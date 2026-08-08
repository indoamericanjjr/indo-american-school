const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const DEFAULT_URL = "https://fkxgbxhnhjjivufjyzuq.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdml6cWJmdWxobHF0b2FiZGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE5MzM3MCwiZXhwIjoyMTAxNzY5MzcwfQ.Pq_0FrXXLtXBBgGvLh9XRWkZ-l1JqnYhuq2ey6ztSMY";

function initSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY;
  if (!url || !key) return null;
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
