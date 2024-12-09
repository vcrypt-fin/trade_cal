// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxvmssqfidodxyoxjtju.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm1zc3FmaWRvZHh5b3hqdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MDczOTMsImV4cCI6MjA0OTE4MzM5M30.zvatXVwWO73YcP4QEs2I50Jq2ymXBdc1tY41w0jTcYI'

export const supabase = createClient(supabaseUrl, supabaseKey)