import { Hero } from "@/components/Hero";
import { TokenDashboard } from "@/components/TokenDashboard";
import { BuySellSection } from "@/components/BuySellSection";
import { TransactionTracker } from "@/components/TransactionTracker";
import { Benefits } from "@/components/Benefits";
import { Roadmap } from "@/components/Roadmap";
import { Whitepaper } from "@/components/Whitepaper";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TokenDashboard />
      <BuySellSection />
      <div className="container mx-auto px-4 py-12">
        <TransactionTracker />
      </div>
      <Benefits />
      <Roadmap />
      <Whitepaper />
      <Footer />
    </div>
  );
};

export default Index;
