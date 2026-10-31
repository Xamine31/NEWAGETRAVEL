import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function clean(value: unknown, max = 2000) {
  return String(value ?? '').trim().slice(0, max)
}

function html(value: unknown) {
  return clean(value, 5000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405)

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return json({ error: 'Configuration Supabase serveur manquante' }, 500)

    const body = await req.json().catch(() => null)
    if (!body) return json({ error: 'Requête invalide' }, 400)

    const payload = {
      name: clean(body.name, 160),
      phone: clean(body.phone, 80),
      email: clean(body.email, 254).toLowerCase(),
      destination: clean(body.destination, 200),
      period: clean(body.period, 200),
      travelers: Math.max(1, Math.min(99, Number(body.travelers) || 1)),
      budget: clean(body.budget, 200),
      message: clean(body.message, 4000),
      voyage_id: clean(body.voyage_id, 200) || null,
      voyage_date_id: clean(body.voyage_date_id, 100) || null,
      custom_start_date: clean(body.custom_start_date, 20) || null,
      custom_end_date: clean(body.custom_end_date, 20) || null,
    }

    if (!payload.name || !payload.phone || !payload.email || !payload.email.includes('@')) {
      return json({ error: 'Nom, téléphone et e-mail valides requis' }, 400)
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 1) La demande est toujours enregistrée dans l'administration.
    const { data: requestRow, error: insertError } = await admin
      .from('quote_requests')
      .insert(payload)
      .select('id,created_at')
      .single()

    if (insertError) {
      console.error('quote insert:', insertError.message)
      return json({ error: `Enregistrement impossible : ${insertError.message}` }, 500)
    }

    // 2) Adresse destinataire configurable depuis Administration > Paramètres.
    const { data: settings } = await admin
      .from('agency_private_settings')
      .select('data')
      .eq('key', 'notifications')
      .maybeSingle()

    const recipient = clean(settings?.data?.quote_email || Deno.env.get('AGENCY_NOTIFICATION_EMAIL') || 'contact@newagetravel.fr', 254)
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = clean(Deno.env.get('RESEND_FROM_EMAIL') || 'New Age Travel <notifications@newagetravel.fr>', 320)

    // Tant que Resend n'est pas configuré, la demande reste quand même enregistrée.
    if (!resendKey) {
      console.warn('RESEND_API_KEY absente : demande enregistrée sans notification e-mail')
      return json({ ok: true, request_id: requestRow.id, notification_sent: false, notification_error: 'RESEND_API_KEY absente' })
    }

    const subject = `Nouvelle demande client — ${payload.destination || 'New Age Travel'}`
    const agencyHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#14213d">
        <h2 style="margin-bottom:6px">Nouvelle demande de voyage</h2>
        <p style="color:#667085;margin-top:0">Une nouvelle demande a été enregistrée sur newagetravel.fr.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Client</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${html(payload.name)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Téléphone</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${html(payload.phone)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>E-mail</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${html(payload.email)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Destination</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${html(payload.destination || 'À définir')}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Période</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${html(payload.period || 'À définir')}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Voyageurs</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${payload.travelers}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Budget</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${html(payload.budget || 'À définir')}</td></tr>
        </table>
        <h3>Message</h3>
        <div style="white-space:pre-wrap;background:#f6f8fb;padding:14px;border-radius:10px">${html(payload.message || 'Aucun message.')}</div>
        <p style="margin-top:20px;color:#667085">La demande complète est également disponible dans l'espace Administration de New Age Travel.</p>
      </div>`

    const clientHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#14213d">
        <h2 style="margin-bottom:8px">Votre demande a bien été enregistrée</h2>
        <p>Bonjour ${html(payload.name)},</p>
        <p>Nous vous confirmons la bonne réception de votre demande auprès de <strong>New Age Travel</strong>.</p>
        <div style="background:#f6f8fb;padding:16px;border-radius:12px;margin:18px 0">
          <p style="margin:0 0 8px"><strong>Destination :</strong> ${html(payload.destination || 'À définir')}</p>
          <p style="margin:0 0 8px"><strong>Période :</strong> ${html(payload.period || 'À définir')}</p>
          <p style="margin:0"><strong>Voyageurs :</strong> ${payload.travelers}</p>
        </div>
        <p>Notre agence reviendra vers vous prochainement pour étudier votre projet de voyage.</p>
        <p style="margin-top:24px">À bientôt,<br><strong>L'équipe New Age Travel</strong><br>212 Avenue de la Capelette, 13010 Marseille<br>04 65 85 93 50</p>
        <p style="font-size:12px;color:#667085;margin-top:24px">Cet e-mail est une confirmation automatique de réception. Pour compléter votre demande, vous pouvez répondre directement à ce message.</p>
      </div>`

    async function sendEmail(data: Record<string, unknown>) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const responseBody = await response.json().catch(() => ({}))
      return { ok: response.ok, status: response.status, body: responseBody }
    }

    // Notification interne à l'agence. Répondre à cet e-mail répond directement au client.
    const agencySend = await sendEmail({
      from: fromEmail,
      to: [recipient],
      reply_to: payload.email,
      subject,
      html: agencyHtml,
    })

    // Accusé de réception automatique au client. Répondre revient vers l'adresse configurée de l'agence.
    const clientSend = await sendEmail({
      from: fromEmail,
      to: [payload.email],
      reply_to: recipient,
      subject: 'Votre demande a bien été reçue — New Age Travel',
      html: clientHtml,
    })

    if (!agencySend.ok) console.error('Resend agence:', agencySend.status, agencySend.body)
    if (!clientSend.ok) console.error('Resend client:', clientSend.status, clientSend.body)

    return json({
      ok: true,
      request_id: requestRow.id,
      notification_sent: agencySend.ok,
      client_confirmation_sent: clientSend.ok,
      notification_error: agencySend.ok ? null : (agencySend.body?.message || `Resend HTTP ${agencySend.status}`),
      client_confirmation_error: clientSend.ok ? null : (clientSend.body?.message || `Resend HTTP ${clientSend.status}`),
      agency_email_id: agencySend.body?.id || null,
      client_email_id: clientSend.body?.id || null,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur serveur inconnue'
    console.error('notify-quote-request:', message)
    return json({ error: message }, 500)
  }
})
