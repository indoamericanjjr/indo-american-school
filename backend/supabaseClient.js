const { createClient } = require('@supabase/supabase-js');

let supabase = null;

function initSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

module.exports = {
  getClient() {
    return supabase || initSupabase();
  }
};
