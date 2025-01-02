// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { setCookie, getCookie, deleteCookie } from '../utils/cookies'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Custom storage implementation using cookies
const cookieStorage = {
  getItem: (key: string) => {
    return getCookie(key) || null;
  },
  setItem: (key: string, value: string) => {
    setCookie(key, value);
  },
  removeItem: (key: string) => {
    deleteCookie(key);
  },
  length: 0, // Required by Supabase but not used
  key: (index: number) => null, // Required by Supabase but not used
  clear: () => {} // Required by Supabase but not used
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token',
    storage: cookieStorage,
    flowType: 'implicit',
    //debug: true // Temporarily enable debug to see what's happening
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});