import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
Deno.serve(async (req) => {
  const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors})
  try{
    const url=Deno.env.get('SUPABASE_URL')!, service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, auth=req.headers.get('Authorization')||''
    const admin=createClient(url,service,{auth:{persistSession:false}})
    const token=auth.replace('Bearer ',''); const {data:{user}}=await admin.auth.getUser(token)
    if(!user) throw new Error('Non autorisé')
    const {data:profile}=await admin.from('profiles').select('role').eq('user_id',user.id).single()
    if(profile?.role!=='super_admin') throw new Error('Réservé à l’administrateur principal')
    const body=await req.json(); const action=body.action
    if(action==='list'){
      const {data,error}=await admin.from('profiles').select('user_id,email,role,created_at').in('role',['admin','super_admin']).order('created_at')
      if(error) throw error; return Response.json({users:data},{headers:cors})
    }
    if(action==='create'){
      const email=String(body.email||'').trim().toLowerCase(), password=String(body.password||'')
      if(!email||password.length<10) throw new Error('E-mail valide et mot de passe de 10 caractères minimum requis')
      const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true}); if(error) throw error
      await admin.from('profiles').upsert({user_id:data.user.id,email,role:'admin'}); return Response.json({ok:true},{headers:cors})
    }
    if(action==='password'){
      if(!body.user_id||String(body.password||'').length<10) throw new Error('Mot de passe de 10 caractères minimum requis')
      const {error}=await admin.auth.admin.updateUserById(body.user_id,{password:String(body.password)}); if(error) throw error
      return Response.json({ok:true},{headers:cors})
    }
    if(action==='delete'){
      if(body.user_id===user.id) throw new Error('Le compte principal ne peut pas se supprimer lui-même')
      const {data:p}=await admin.from('profiles').select('role').eq('user_id',body.user_id).maybeSingle(); if(p?.role==='super_admin') throw new Error('Le compte principal ne peut pas être supprimé ici')
      const {error}=await admin.auth.admin.deleteUser(body.user_id); if(error) throw error
      return Response.json({ok:true},{headers:cors})
    }
    throw new Error('Action inconnue')
  }catch(e){return Response.json({error:e instanceof Error?e.message:'Erreur'},{status:400,headers:cors})}
})
