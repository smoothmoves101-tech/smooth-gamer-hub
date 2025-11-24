import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export const Roadmap = () => {
  const phases = [
    {
      phase: "Phase 1",
      title: "Token Launch",
      status: "current" as const,
      items: [
        "Smart contract deployment on Polygon",
        "Website launch",
        "Presale opens (200K tokens)",
        "MetaMask integration",
      ],
    },
    {
      phase: "Phase 2",
      title: "Community Building",
      status: "upcoming" as const,
      items: [
        "Marketing campaign launch",
        "Social media expansion",
        "Partnership announcements",
        "First airdrop to holders",
      ],
    },
    {
      phase: "Phase 3",
      title: "Ecosystem Development",
      status: "upcoming" as const,
      items: [
        "SmoothMoves AI Studio beta launch",
        "NFT collection release",
        "Gaming platform preview",
        "Governance system implementation",
      ],
    },
    {
      phase: "Phase 4",
      title: "Platform Launch",
      status: "upcoming" as const,
      items: [
        "Full gaming platform launch",
        "Exchange listings",
        "Mobile app release",
        "Community events & tournaments",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">Our journey to revolutionize gaming</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase, index) => {
            const StatusIcon = 
              phase.status === "current" ? Clock : Circle;

            return (
              <Card
                key={index}
                className={`p-6 bg-card/50 backdrop-blur border-border transition-all duration-300 ${
                  phase.status === "current" 
                    ? "border-primary shadow-glow" 
                    : "hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-2 rounded-lg ${
                    phase.status === "current" 
                      ? "bg-primary/20" 
                      : "bg-muted/50"
                  }`}>
                    <StatusIcon className={`w-6 h-6 ${
                      phase.status === "current" 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{phase.phase}</p>
                    <h3 className="text-2xl font-bold text-foreground">{phase.title}</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
