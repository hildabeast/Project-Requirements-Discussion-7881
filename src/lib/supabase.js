import { createClient } from '@supabase/supabase-js';

// FIXED: Use environment variables with fallbacks for Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kdohilkyqmkigjvptqir.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkb2hpbGt5cW1raWdqdnB0cWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzcyMzMsImV4cCI6MjA2NzQxMzIzM30._HboLAkpNFj4AZJmG1p3cje4Hdru2cr411-GAofT610';

// Validate Supabase credentials
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || 
    SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || 
    SUPABASE_ANON_KEY === '<ANON_KEY>') {
  console.error('Missing or invalid Supabase credentials');
}

// Create and export the Supabase client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'readysetgoteach-supabase-auth'
  }
});

// Add connection verification with better error handling
(async () => {
  try {
    const { error } = await supabaseClient.from('courses_cb_2024').select('id').limit(1);
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connected successfully');
    }
  } catch (err) {
    console.error('Failed to verify Supabase connection:', err.message);
  }
})();

export default supabaseClient;