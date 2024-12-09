import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log(`Function "browser-with-cors" up and running!`)

const URL = "https://wxvmssqfidodxyoxjtju.supabase.co"
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm1zc3FmaWRvZHh5b3hqdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MDczOTMsImV4cCI6MjA0OTE4MzM5M30.zvatXVwWO73YcP4QEs2I50Jq2ymXBdc1tY41w0jTcYI"

const supabase = createClient(URL, KEY)

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const data = await req.json()

    console.log(data)

    switch (data.type) {
      case 'github':
        const { data, error } = await supabase.auth.signInWithOAuth({ 
          provider: 'github',
          options: {
            redirectTo: 'http://localhost:5173/github/callback',
          },
       });
        
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          })
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      default:
        return new Response(JSON.stringify({ error: 'Could not find type' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }
      

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})