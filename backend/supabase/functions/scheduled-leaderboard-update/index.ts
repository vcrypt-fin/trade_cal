import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Hello from Scheduled Leaderboard Update!')

const updateLeaderboardStats = async (supabaseClient: any) => {
  try {
    // First update all user statistics
    const { error: rpcError } = await supabaseClient
      .rpc('update_user_statistics')

    if (rpcError) throw rpcError

    // Then update rankings in leaderboard_stats
    const { error: rankingError } = await supabaseClient
      .rpc('update_leaderboard_rankings')

    if (rankingError) throw rankingError

    console.log('Successfully updated leaderboard rankings')
    return true
  } catch (error) {
    console.error('Error updating leaderboard stats:', error)
    return false
  }
}

serve(async (_req) => {
  try {
    // Create Supabase client with service role key
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

    const success = await updateLeaderboardStats(supabaseClient)

    return new Response(
      JSON.stringify({ success }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 