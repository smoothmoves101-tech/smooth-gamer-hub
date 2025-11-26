import { AdminLiquidityPanel } from '@/components/AdminLiquidityPanel';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { isConnected, connectWallet } = useWeb3();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage liquidity and token distribution</p>
          </div>

          {!isConnected ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Connect your wallet to access admin features</p>
              <Button onClick={connectWallet} size="lg" className="bg-gradient-primary">
                Connect Wallet
              </Button>
            </div>
          ) : (
            <AdminLiquidityPanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;