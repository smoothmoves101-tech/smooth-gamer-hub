import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle2, XCircle, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export const AdminTransactionTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'fulfilled' | 'failed'>('all');

  useEffect(() => {
    fetchTransactions();
    setupRealtimeSubscription();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('token_orders')
        .select('*')
        .eq('order_type', 'buy')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin-transaction-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_orders',
        },
        (payload) => {
          console.log('Admin transaction update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setTransactions((prev) => [payload.new as Transaction, ...prev].slice(0, 50));
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
      pending: "Pending",
      fulfilled: "Fulfilled",
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

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const stats = {
    total: transactions.length,
    pending: transactions.filter((tx) => tx.status === 'pending').length,
    fulfilled: transactions.filter((tx) => tx.status === 'fulfilled').length,
    failed: transactions.filter((tx) => tx.status === 'failed').length,
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border shadow-glow-secondary">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">All Transactions</h3>
          <p className="text-sm text-muted-foreground">Real-time monitoring of all token purchases</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-lg border border-orange-500/20">
          <div className="text-sm text-muted-foreground mb-1">Pending</div>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className="text-sm text-muted-foreground mb-1">Fulfilled</div>
          <div className="text-2xl font-bold">{stats.fulfilled}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
          <div className="text-sm text-muted-foreground mb-1">Failed</div>
          <div className="text-2xl font-bold">{stats.failed}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled ({stats.fulfilled})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({stats.failed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Transaction List */}
      <ScrollArea className="h-[500px] pr-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No {filter !== 'all' ? filter : ''} transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-lg border border-border bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="text-xs text-muted-foreground font-mono">
                    {tx.wallet_address.substring(0, 8)}...{tx.wallet_address.substring(tx.wallet_address.length - 6)}
                  </div>
                  
                  {tx.transaction_hash && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                      onClick={() => openTransaction(tx.transaction_hash!)}
                    >
                      <span className="font-mono">
                        {tx.transaction_hash.substring(0, 8)}...
                        {tx.transaction_hash.substring(tx.transaction_hash.length - 6)}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>

                {tx.status === 'fulfilled' && tx.fulfilled_at && (
                  <div className="mt-2 text-xs text-green-500">
                    Distributed on {formatDate(tx.fulfilled_at)}
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
