const { createClient } = require('@supabase/supabase-js');

let supabase = null;

function initSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn('Backend: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/ANON_KEY not set in environment.');
    return null;
  }
  try {
    supabase = createClient(url, key);
    return supabase;
  } catch (e) {
    console.error('Failed to create Supabase client:', e.message);
    return null;
  }
}

module.exports = {
  getClient() {
    return supabase || initSupabase();
  }
};

