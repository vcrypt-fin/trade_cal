import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from Update Leaderboard!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authorization token')
    }

    // Parse request body
    const { userId } = await req.json()

    // Verify the user is updating their own stats
    if (userId !== user.id) {
      throw new Error('Unauthorized: Can only update your own stats')
    }

    // If userId is provided, update just that user
    if (userId) {
      const { error: rpcError } = await supabaseClient
        .rpc('update_single_user_statistics', { user_id: userId })

      if (rpcError) {
        throw rpcError
      }

      console.log(`Successfully updated statistics for user: ${userId}`)
    } else {
      // Otherwise, update all users (for scheduled updates)
      const { error: rpcError } = await supabaseClient
        .rpc('update_user_statistics')

      if (rpcError) {
        throw rpcError
      }

      console.log('Successfully updated all user statistics')
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Unauthorized') ? 401 : 500,
      }
    )
  }
}) 