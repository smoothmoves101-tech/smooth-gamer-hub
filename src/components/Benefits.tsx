import { Card } from "@/components/ui/card";
import { Gamepad2, Gift, Vote, Sparkles, Image, Rocket } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      icon: Gamepad2,
      title: "Gaming Ecosystem Access",
      description: "Exclusive access to The Smooth Gamer gaming platform and ecosystem",
    },
    {
      icon: Sparkles,
      title: "SmoothMoves AI Studio",
      description: "Premium perks and features in our AI-powered creative studio",
    },
    {
      icon: Gift,
      title: "Airdrops & Rewards",
      description: "Regular token airdrops and exclusive rewards for early holders",
    },
    {
      icon: Vote,
      title: "Voting Rights",
      description: "Participate in governance and shape the future of the ecosystem",
    },
    {
      icon: Image,
      title: "Exclusive NFTs",
      description: "Access to limited edition NFT collections and gaming assets",
    },
    {
      icon: Rocket,
      title: "Early Access",
      description: "First access to new features, games, and platform updates",
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Token Benefits
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hold SMOOTH tokens and unlock exclusive perks in our gaming ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group"
              >
                <div className="mb-4 p-3 rounded-lg bg-gradient-glow inline-block group-hover:shadow-glow transition-all">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
