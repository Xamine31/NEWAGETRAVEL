// Configuration publique Supabase.
// Remplace uniquement ces deux valeurs après avoir créé ton projet Supabase.
window.NAT_SUPABASE = {
  url: 'https://jezhrrkbnwsaucrblpug.supabase.co',
  anonKey: 'sb_publishable_jwDiesSbcYoou18SF74zxw_-orSm8IC'
};

window.NAT_USE_SUPABASE = Boolean(
  window.NAT_SUPABASE?.url &&
  window.NAT_SUPABASE?.anonKey &&
  !window.NAT_SUPABASE.url.includes('TON-PROJET') &&
  !window.NAT_SUPABASE.anonKey.includes('TA_CLE')
);

window.NAT_SUPABASE_CLIENT = window.NAT_USE_SUPABASE && window.supabase
  ? window.supabase.createClient(window.NAT_SUPABASE.url, window.NAT_SUPABASE.anonKey)
  : null;
