import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';
import { Wallet, JsonRpcProvider, Contract, parseUnits, formatUnits } from 'https://esm.sh/ethers@6.15.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CONTRACT_ADDRESS = "0x9F62d8Eaf274dba756C8189AeA325704Dc8BeE5a";
const CONTRACT_ABI = [
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const POLYGON_RPC = "https://polygon-rpc.com";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const seedPhrase = Deno.env.get('DISTRIBUTION_WALLET_SEED_PHRASE');

    if (!seedPhrase) {
      throw new Error('Distribution wallet seed phrase not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting token distribution...');

    // Get pending orders
    const { data: pendingOrders, error: fetchError } = await supabase
      .from('token_orders')
      .select('*')
      .eq('status', 'pending')
      .eq('order_type', 'buy')
      .is('fulfilled_at', null)
      .order('created_at', { ascending: true })
      .limit(10); // Process 10 at a time

    if (fetchError) {
      console.error('Error fetching orders:', fetchError);
      throw fetchError;
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      console.log('No pending orders to process');
      return new Response(
        JSON.stringify({ success: true, message: 'No pending orders', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${pendingOrders.length} pending orders`);

    // Create wallet from seed phrase
    const provider = new JsonRpcProvider(POLYGON_RPC);
    const wallet = Wallet.fromPhrase(seedPhrase).connect(provider);
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    console.log('Distribution wallet address:', wallet.address);

    // Get contract decimals
    const decimals = await contract.decimals();
    console.log('Token decimals:', decimals.toString());

    const results = [];

    // Process each order
    for (const order of pendingOrders) {
      try {
        console.log(`Processing order ${order.id} for ${order.token_amount} tokens to ${order.wallet_address}`);

        // Convert token amount to proper units
        const amount = parseUnits(order.token_amount.toString(), decimals);

        // Check distribution wallet balance
        const balance = await contract.balanceOf(wallet.address);
        console.log(`Distribution wallet balance: ${formatUnits(balance, decimals)}`);

        if (balance < amount) {
          console.error(`Insufficient balance for order ${order.id}. Need: ${formatUnits(amount, decimals)}, Have: ${formatUnits(balance, decimals)}`);
          results.push({ 
            orderId: order.id, 
            success: false, 
            error: 'Insufficient distribution wallet balance' 
          });
          continue;
        }

        // Transfer tokens
        const tx = await contract.transfer(order.wallet_address, amount);
        console.log(`Transaction sent: ${tx.hash}`);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

        // Update order status
        const { error: updateError } = await supabase
          .from('token_orders')
          .update({
            status: 'fulfilled',
            fulfilled_at: new Date().toISOString(),
            transaction_hash: tx.hash,
          })
          .eq('id', order.id);

        if (updateError) {
          console.error(`Error updating order ${order.id}:`, updateError);
          results.push({ 
            orderId: order.id, 
            success: false, 
            error: 'Failed to update order status',
            txHash: tx.hash 
          });
        } else {
          console.log(`Successfully processed order ${order.id}`);
          results.push({ 
            orderId: order.id, 
            success: true, 
            txHash: tx.hash 
          });
        }

      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        results.push({ 
          orderId: order.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Distribution complete. Processed ${successCount}/${results.length} orders successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: successCount,
        total: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Distribution error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
