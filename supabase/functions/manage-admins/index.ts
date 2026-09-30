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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée', stage: 'method' }, 405)

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !serviceKey) return json({ error: 'Configuration serveur Supabase manquante', stage: 'environment' }, 500)

    const authorization = req.headers.get('Authorization') || ''
    if (!authorization.toLowerCase().startsWith('bearer ')) {
      return json({ error: 'Session administrateur absente', stage: 'authorization' }, 401)
    }

    // Client serveur pour les opérations Auth Admin et les lectures protégées.
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // Vérifie réellement le JWT auprès de Supabase Auth. On ne fait pas confiance
    // à un user_id envoyé par le navigateur.
    const token = authorization.slice(7).trim()
    const { data: userData, error: userError } = await admin.auth.getUser(token)
    if (userError || !userData.user) {
      console.error('manage-admins auth:', userError?.message || 'Utilisateur absent')
      return json({ error: 'Session expirée ou invalide. Reconnectez-vous.', stage: 'auth-user' }, 401)
    }
    const user = userData.user

    const { data: profile, error: profileError } = await admin
      .from('profiles').select('role,email').eq('user_id', user.id).maybeSingle()
    if (profileError) {
      console.error('manage-admins profile:', profileError.message)
      return json({ error: `Profil administrateur inaccessible : ${profileError.message}`, stage: 'profile' }, 500)
    }
    if (profile?.role !== 'super_admin') {
      return json({ error: 'Réservé à l’administrateur principal', stage: 'role' }, 403)
    }

    let body: Record<string, unknown>
    try { body = await req.json() } catch { return json({ error: 'Requête invalide', stage: 'body' }, 400) }
    const action = String(body.action || '')

    if (action === 'list') {
      const { data, error } = await admin.from('profiles')
        .select('user_id,email,role,created_at')
        .in('role', ['admin', 'super_admin']).order('created_at')
      if (error) throw new Error(`Liste des comptes : ${error.message}`)
      return json({ users: data || [] })
    }

    if (action === 'create') {
      const email = String(body.email || '').trim().toLowerCase()
      const password = String(body.password || '')
      if (!email || !email.includes('@')) return json({ error: 'Adresse e-mail invalide', stage: 'create' }, 400)
      if (password.length < 10) return json({ error: 'Le mot de passe doit contenir au moins 10 caractères', stage: 'create' }, 400)
      const { count, error: countError } = await admin.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin','super_admin'])
      if (countError) throw new Error(`Vérification des comptes : ${countError.message}`)
      if ((count || 0) >= 3) return json({ error: 'La limite de 3 comptes administrateurs est atteinte', stage: 'create' }, 400)
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
      if (error || !data.user) throw new Error(`Création du compte : ${error?.message || 'utilisateur absent'}`)
      const { error: upsertError } = await admin.from('profiles').upsert({ user_id: data.user.id, email, role: 'admin' })
      if (upsertError) { await admin.auth.admin.deleteUser(data.user.id); throw new Error(`Création du profil : ${upsertError.message}`) }
      return json({ ok: true })
    }

    if (action === 'password') {
      const targetId = String(body.user_id || '')
      const password = String(body.password || '')
      if (!targetId || password.length < 10) return json({ error: 'Mot de passe de 10 caractères minimum requis', stage: 'password' }, 400)
      const { data: target } = await admin.from('profiles').select('role').eq('user_id', targetId).maybeSingle()
      if (target?.role === 'super_admin' && targetId !== user.id) return json({ error: 'Modification du compte principal refusée', stage: 'password' }, 403)
      const { error } = await admin.auth.admin.updateUserById(targetId, { password })
      if (error) throw new Error(`Modification du mot de passe : ${error.message}`)
      return json({ ok: true })
    }

    if (action === 'email') {
      const targetId = String(body.user_id || '').trim()
      const email = String(body.email || '').trim().toLowerCase()
      if (!targetId) return json({ error: 'Compte introuvable', stage: 'email' }, 400)
      if (!email || !email.includes('@')) return json({ error: 'Adresse e-mail invalide', stage: 'email' }, 400)

      const { data: target, error: targetError } = await admin
        .from('profiles').select('role').eq('user_id', targetId).maybeSingle()
      if (targetError) throw new Error(`Vérification du compte : ${targetError.message}`)
      if (!target) return json({ error: 'Compte administrateur introuvable', stage: 'email' }, 404)

      const { error: authError } = await admin.auth.admin.updateUserById(targetId, { email, email_confirm: true })
      if (authError) throw new Error(`Modification de l’adresse e-mail : ${authError.message}`)

      const { error: profileUpdateError } = await admin.from('profiles').update({ email }).eq('user_id', targetId)
      if (profileUpdateError) {
        return json({ error: `Adresse Auth modifiée mais profil non synchronisé : ${profileUpdateError.message}`, stage: 'email-profile' }, 500)
      }
      return json({ ok: true, email })
    }

    if (action === 'delete') {
      const targetId = String(body.user_id || '')
      if (!targetId) return json({ error: 'Compte introuvable', stage: 'delete' }, 400)
      if (targetId === user.id) return json({ error: 'Le compte principal ne peut pas se supprimer lui-même', stage: 'delete' }, 403)
      const { data: target, error: targetError } = await admin.from('profiles').select('role').eq('user_id', targetId).maybeSingle()
      if (targetError) throw new Error(`Vérification du compte : ${targetError.message}`)
      if (target?.role === 'super_admin') return json({ error: 'Le compte principal ne peut pas être supprimé ici', stage: 'delete' }, 403)
      const { error } = await admin.auth.admin.deleteUser(targetId)
      if (error) throw new Error(`Suppression du compte : ${error.message}`)
      return json({ ok: true })
    }

    return json({ error: 'Action inconnue', stage: 'action' }, 400)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur serveur inconnue'
    console.error('manage-admins:', message)
    return json({ error: message, stage: 'server' }, 500)
  }
})
