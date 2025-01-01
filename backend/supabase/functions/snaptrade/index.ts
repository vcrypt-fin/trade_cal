import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
// Snaptrade SDK is available as an NPM package. For Deno, you'll need a Deno-compatible version or a bundler step.
// If you're able to import it directly, do so. Otherwise, see below for a bundling approach.
import { Snaptrade } from "./snaptrade/mod.js"

// SnapTrade API Credentials
const SNAP_KEY = "VCRYPT-SOFTWARE-LLC"
const SNAP_SECRET = "3Xn7XlIzA7k09RO6OKNs36yb6crxGHgbRFulJXjUNDXRv1GzEx"
// Initialize SnapTrade client
const snaptrade = new Snaptrade({
    clientId: SNAP_KEY,
    consumerKey: SNAP_SECRET,
})

// Supabase credentials
const URL = "https://wxvmssqfidodxyoxjtju.supabase.co"
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm1zc3FmaWRvZHh5b3hqdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MDczOTMsImV4cCI6MjA0OTE4MzM5M30.zvatXVwWO73YcP4QEs2I50Jq2ymXBdc1tY41w0jTcYI"

const supabase = createClient(URL, KEY)

/**
 * 
 * This Supabase Edge Function handles multiple "types" of requests that
 * replicate the endpoints you had in your Bun server:
 * 
 * - snaptrade-newuser
 * - snaptrade-login
 * - snaptrade-pull-holdings
 * 
 * The client can call this function with a JSON payload of the form:
 * {
 *   "type": "snaptrade-newuser", // or "snaptrade-login", "snaptrade-pull-holdings"
 *   "userId": "...",
 *   "userSecret": "...",
 *   "accountId": "...",
 *   ...
 * }
 */
Deno.serve(async (req) => {
    // Handle the CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Parse the incoming JSON body
        const body = await req.json()
        const { type } = body

        const url = req.url

        console.log(req.method, type, url)

        switch (type) {
            /**
             * 1) Create a new SnapTrade user
             * 
             * Expects `body.userId` from client
             */
            case "snaptrade-newuser": {
                // Register a new SnapTrade user
                try {
                    // Generate new user UUID
                    let new_user_id = crypto.randomUUID();

                    const new_res = await snaptrade.authentication.registerSnapTradeUser({
                        userId: new_user_id,
                    })

                    // Extract the userId & userSecret from the response
                    const { userId: snap_user_id, userSecret: snap_user_secret } = new_res.data || {}

                    console.log("New SnapTrade user:", snap_user_id, snap_user_secret)
                    // Insert into your "snap_users" table
                    // (Adjust table/column names as needed)
                    let supabase_res = await supabase.from("snap_users").insert({
                        user_id: body.userId,
                        snap_user_id,
                        snap_user_secret,
                        accounts: [],
                    })

                    console.log("Supabase response:", supabase_res)

                    return new Response(JSON.stringify(new_res.data), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    })
                } catch (error) {
                    console.error("Error creating SnapTrade user:", error)
                    return new Response(JSON.stringify({ error: error.message }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 500,
                    })
                }
            }

            /**
             * 2) Log in to SnapTrade
             * 
             * Expects `body.userId`, `body.userSecret`, `body.broker` from client
             */
            case "snaptrade-login": {
                // Optionally replace with your actual redirect:
                try {
                    const redirect = "cal.vcryptfinancial.com"

                    let { userId, userSecret, broker } = body
                    let res = await snaptrade.authentication.loginSnapTradeUser({
                        userId,
                        userSecret,
                        redirect: `http://${redirect}`,
                    })

                    return new Response(JSON.stringify(res.data), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    })
                } catch (error) {
                    console.error("Error creating SnapTrade user:", error)
                    return new Response(JSON.stringify({ error: error.message }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 500,
                    })
                }
            }

            /**
             * 3) Pull Holdings
             * 
             * Expects `body.accountId`, `body.userId` (as `uId`), `body.userSecret` (as `uSecret`)
             */
            case "snaptrade-pull-holdings": {
                let { accountId, uId, uSecret } = body

                let holding_res = await snaptrade.accountInformation.getUserHoldings({
                    accountId,
                    userId: uId,
                    userSecret: uSecret,
                })

                return new Response(JSON.stringify(holding_res.data), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                })
            }

            // Default fallback
            default: {
                return new Response(
                    JSON.stringify({ error: `Unknown type: ${type}` }),
                    {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 400,
                    }
                )
            }
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
