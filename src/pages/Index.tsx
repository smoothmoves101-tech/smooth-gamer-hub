import { Hero } from "@/components/Hero";
import { TokenDashboard } from "@/components/TokenDashboard";
import { BuySellSection } from "@/components/BuySellSection";
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
      <Benefits />
      <Roadmap />
      <Whitepaper />
      <Footer />
    </div>
  );
};

export default Index;
