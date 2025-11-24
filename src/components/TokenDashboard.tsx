import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Coins, PieChart } from "lucide-react";

export const TokenDashboard = () => {
  const stats = [
    {
      icon: DollarSign,
      label: "Current Price",
      value: "$0.005",
      change: "+0%",
      changeType: "neutral" as const,
    },
    {
      icon: Coins,
      label: "Total Supply",
      value: "200,000",
      subtitle: "SMOOTH Tokens",
      changeType: "neutral" as const,
    },
    {
      icon: PieChart,
      label: "Market Cap",
      value: "$1,000",
      subtitle: "USD",
      changeType: "neutral" as const,
    },
    {
      icon: TrendingUp,
      label: "24h Volume",
      value: "$0",
      change: "0%",
      changeType: "neutral" as const,
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Token Dashboard
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">Real-time statistics and market data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  {stat.change && (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Price Chart Placeholder */}
        <Card className="mt-8 p-6 bg-card/50 backdrop-blur border-border">
          <h3 className="text-xl font-bold mb-4 text-foreground">Price Chart</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">Chart will be integrated with live data</p>
          </div>
        </Card>
      </div>
    </section>
  );
};
