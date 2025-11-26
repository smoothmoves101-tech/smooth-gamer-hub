import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUniswapLiquidity } from '@/hooks/useUniswapLiquidity';
import { useWeb3 } from '@/hooks/useWeb3';
import { Droplets, TrendingUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLiquidityPanel = () => {
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [totalPOL, setTotalPOL] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { addLiquidity, loading } = useUniswapLiquidity();
  const { isConnected, account } = useWeb3();

  const fetchPendingOrders = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from('token_orders')
      .select('*')
      .eq('liquidity_added', false)
      .eq('order_type', 'buy')
      .eq('status', 'completed');

    if (error) {
      toast.error('Failed to fetch pending orders');
      console.error(error);
    } else {
      setPendingOrders(data || []);
      const pol = data?.reduce((sum, order) => sum + Number(order.payment_amount), 0) || 0;
      const tokens = data?.reduce((sum, order) => sum + Number(order.token_amount), 0) || 0;
      setTotalPOL(pol);
      setTotalTokens(tokens);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleAddLiquidity = async () => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return;
    }

    if (pendingOrders.length === 0) {
      toast.error('No pending orders to add liquidity for');
      return;
    }

    const result = await addLiquidity(totalTokens.toString(), totalPOL.toString());

    if (result.success) {
      // Mark orders as liquidity added
      const orderIds = pendingOrders.map(order => order.id);
      const { error } = await supabase
        .from('token_orders')
        .update({ liquidity_added: true })
        .in('id', orderIds);

      if (error) {
        console.error('Failed to update orders:', error);
        toast.error('Liquidity added but failed to update orders');
      } else {
        toast.success('Orders marked as liquidity added');
        fetchPendingOrders();
      }
    }
  };

  return (
    <Card className="p-8 bg-card/50 backdrop-blur border-border shadow-glow-secondary">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-lg">
            <Droplets className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Liquidity Management</h2>
            <p className="text-sm text-muted-foreground">Add accumulated sales to Uniswap pool</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchPendingOrders}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">Pending Orders</div>
          <div className="text-3xl font-bold">{pendingOrders.length}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
          <div className="text-sm text-muted-foreground mb-1">Total POL</div>
          <div className="text-3xl font-bold">{totalPOL.toFixed(4)}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className="text-sm text-muted-foreground mb-1">Total SGT Tokens</div>
          <div className="text-3xl font-bold">{totalTokens.toFixed(2)}</div>
        </div>
      </div>

      {pendingOrders.length > 0 ? (
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Click "Add Liquidity" to add accumulated POL and SGT tokens to the Uniswap pool</li>
              <li>You'll need to approve the transaction in MetaMask</li>
              <li>This will pair {totalTokens.toFixed(2)} SGT with {totalPOL.toFixed(4)} POL in the liquidity pool</li>
              <li>After success, these orders will be marked as processed</li>
            </ul>
          </div>

          <Button
            onClick={handleAddLiquidity}
            disabled={loading || !isConnected}
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
            size="lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            {loading ? 'Adding Liquidity...' : 'Add Liquidity to Uniswap'}
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Droplets className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pending orders to add liquidity for</p>
        </div>
      )}
    </Card>
  );
};