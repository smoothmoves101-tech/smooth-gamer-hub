import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/hooks/useWeb3';
import { Clock, CheckCircle2, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  wallet_address: string;
  token_amount: number;
  payment_amount: number;
  payment_currency: string;
  status: string;
  transaction_hash: string | null;
  created_at: string;
  fulfilled_at: string | null;
  order_type: string;
}

export const TransactionTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  useEffect(() => {
    if (!account) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    fetchTransactions();
    setupRealtimeSubscription();
  }, [account]);

  const fetchTransactions = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('token_orders')
        .select('*')
        .eq('wallet_address', account)
        .eq('order_type', 'buy')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!account) return;

    const channel = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_orders',
          filter: `wallet_address=eq.${account}`,
        },
        (payload) => {
          console.log('Transaction update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setTransactions((prev) => [payload.new as Transaction, ...prev].slice(0, 10));
          } else if (payload.eventType === 'UPDATE') {
            setTransactions((prev) =>
              prev.map((tx) => (tx.id === payload.new.id ? (payload.new as Transaction) : tx))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500 animate-pulse" />;
      case 'fulfilled':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      fulfilled: "default",
      failed: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Pending Distribution",
      fulfilled: "Confirmed",
      failed: "Failed",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openTransaction = (hash: string) => {
    window.open(`https://polygonscan.com/tx/${hash}`, '_blank');
  };

  if (!account) {
    return (
      <Card className="p-8 bg-card/50 backdrop-blur border-border">
        <div className="text-center text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Connect your wallet to view transaction history</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border shadow-glow-secondary">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">Real-time updates</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Your purchases will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">
                        {tx.token_amount.toLocaleString()} SGT
                      </span>
                      {getStatusBadge(tx.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tx.payment_amount.toFixed(4)} {tx.payment_currency}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {formatDate(tx.created_at)}
                  </div>
                </div>

                {tx.transaction_hash && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                      onClick={() => openTransaction(tx.transaction_hash!)}
                    >
                      <span className="font-mono">
                        {tx.transaction_hash.substring(0, 10)}...
                        {tx.transaction_hash.substring(tx.transaction_hash.length - 8)}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}

                {tx.status === 'fulfilled' && tx.fulfilled_at && (
                  <div className="mt-2 text-xs text-green-500">
                    Tokens distributed on {formatDate(tx.fulfilled_at)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
