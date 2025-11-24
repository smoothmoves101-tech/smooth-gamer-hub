import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ShoppingCart, TrendingDown, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BuySellSection = () => {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "MetaMask Connection",
      description: "MetaMask integration will be configured with your contract address.",
    });
  };

  const handleTransaction = (type: "buy" | "sell") => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `${type === "buy" ? "Buy" : "Sell"} Order`,
      description: `Transaction for ${amount} SMOOTH tokens will be processed via MetaMask.`,
    });
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Buy & Sell
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">Trade SMOOTH tokens directly with MetaMask</p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur border-border shadow-glow-secondary">
          {/* Wallet Connection */}
          <div className="mb-8 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Wallet Status</p>
                  <p className="text-sm text-muted-foreground">Not Connected</p>
                </div>
              </div>
              <Button 
                onClick={handleConnect}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect MetaMask
              </Button>
            </div>
          </div>

          {/* Buy/Sell Tabs */}
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="buy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <TrendingDown className="w-4 h-4 mr-2" />
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="buy-amount" className="text-foreground">Amount (SMOOTH)</Label>
                  <Input
                    id="buy-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2 bg-background border-border text-foreground"
                  />
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per token</span>
                    <span className="font-semibold text-foreground">$0.005</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Presale Bonus (10%)</span>
                    <span className="font-semibold text-primary">+{amount ? (parseFloat(amount) * 0.1).toFixed(2) : '0.00'} SMOOTH</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-bold text-foreground">${amount ? (parseFloat(amount) * 0.005).toFixed(4) : '0.0000'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <strong>Early Investor Bonus:</strong> Buy $50 or more and get an extra 10% SMOOTH tokens added to your wallet!
                  </p>
                </div>

                <Button 
                  onClick={() => handleTransaction("buy")}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy SMOOTH Tokens
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sell" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sell-amount" className="text-foreground">Amount (SMOOTH)</Label>
                  <Input
                    id="sell-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2 bg-background border-border text-foreground"
                  />
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per token</span>
                    <span className="font-semibold text-foreground">$0.005</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">You'll receive</span>
                    <span className="font-bold text-foreground">${amount ? (parseFloat(amount) * 0.005).toFixed(4) : '0.0000'}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleTransaction("sell")}
                  className="w-full bg-secondary hover:opacity-90 text-secondary-foreground font-bold text-lg py-6"
                  size="lg"
                >
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Sell SMOOTH Tokens
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
};
