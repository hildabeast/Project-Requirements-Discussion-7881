import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kdohilkyqmkigjvptqir.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkb2hpbGt5cW1raWdqdnB0cWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzcyMzMsImV4cCI6MjA2NzQxMzIzM30._HboLAkpNFj4AZJmG1p3cje4Hdru2cr411-GAofT610'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})