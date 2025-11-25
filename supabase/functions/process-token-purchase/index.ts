import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PurchaseRequest {
  walletAddress: string
  tokenAmount: number
  paymentAmount: number
  transactionHash: string
  orderType: 'buy' | 'sell'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { walletAddress, tokenAmount, paymentAmount, transactionHash, orderType }: PurchaseRequest = await req.json()

    console.log('Processing token purchase:', { walletAddress, tokenAmount, paymentAmount, orderType, transactionHash })

    // Validate input
    if (!walletAddress || !tokenAmount || !paymentAmount || !transactionHash) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (tokenAmount <= 0 || paymentAmount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amounts' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if transaction already exists
    const { data: existingOrder } = await supabaseClient
      .from('token_orders')
      .select('id')
      .eq('transaction_hash', transactionHash)
      .maybeSingle()

    if (existingOrder) {
      return new Response(
        JSON.stringify({ error: 'Transaction already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
      )
    }

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from('token_orders')
      .insert({
        wallet_address: walletAddress,
        order_type: orderType,
        token_amount: tokenAmount,
        payment_amount: paymentAmount,
        payment_currency: 'MATIC',
        transaction_hash: transactionHash,
        status: 'completed'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Order created successfully:', order)

    return new Response(
      JSON.stringify({ 
        success: true, 
        order,
        message: `${orderType === 'buy' ? 'Purchase' : 'Sale'} recorded successfully!` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
