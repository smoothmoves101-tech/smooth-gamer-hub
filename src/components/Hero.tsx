import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Wallet } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";

export const Hero = () => {
  const { isConnected, isConnecting, connectWallet, account } = useWeb3();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(186_100%_50%_/_0.1),_transparent_50%)]" />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 shadow-glow">
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">
            PRESALE NOW LIVE - Limited to 200K Tokens
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            THE SMOOTH
          </span>
          <br />
          <span className="text-foreground">GAMER TOKEN</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Powering the next generation of gaming ecosystem. Get exclusive access to 
          <span className="text-primary font-semibold"> SmoothMoves AI Studio</span>, 
          NFTs, airdrops, and voting rights.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
          <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-primary">$0.005</div>
            <div className="text-sm text-muted-foreground">Launch Price</div>
          </div>
          <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-primary">200K</div>
            <div className="text-sm text-muted-foreground">Presale Tokens</div>
          </div>
          <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-secondary">10%</div>
            <div className="text-sm text-muted-foreground">Presale Bonus</div>
          </div>
          <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-2xl md:text-3xl font-bold text-secondary">$800</div>
            <div className="text-sm text-muted-foreground">Target Value</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          {isConnected ? (
            <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card border border-primary/50 shadow-glow">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Connected</p>
                <p className="font-mono text-sm text-foreground">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
              </div>
            </div>
          ) : (
            <Button 
              size="lg"
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-glow group"
            >
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
              <Zap className="ml-2 w-5 h-5 group-hover:animate-pulse" />
            </Button>
          )}
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 font-semibold text-lg px-8 py-6 group"
          >
            Read Whitepaper
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
