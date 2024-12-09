// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wxvmssqfidodxyoxjtju.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm1zc3FmaWRvZHh5b3hqdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MDczOTMsImV4cCI6MjA0OTE4MzM5M30.zvatXVwWO73YcP4QEs2I50Jq2ymXBdc1tY41w0jTcYI'

export let supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)