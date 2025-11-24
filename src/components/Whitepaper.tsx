import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export const Whitepaper = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 md:p-12 bg-card/50 backdrop-blur border-border">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="p-6 rounded-2xl bg-gradient-glow flex-shrink-0">
              <FileText className="w-16 h-16 text-primary" />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Whitepaper
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Learn everything about The Smooth Gamer ecosystem, tokenomics, and our vision for the future of gaming.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-bold text-foreground mb-2">What is SMOOTH Token?</h3>
                  <p className="text-muted-foreground">
                    SMOOTH (The Smooth Gamer Token) is the native utility token powering our gaming ecosystem. 
                    It provides access to exclusive features, governance rights, and rewards within our platform.
                  </p>
                </div>

                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="font-bold text-foreground mb-2">Gaming Ecosystem</h3>
                  <p className="text-muted-foreground">
                    Our platform integrates AI-powered creative tools, NFT marketplaces, and immersive gaming 
                    experiences. Token holders gain early access to new games, exclusive NFTs, and premium features.
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-bold text-foreground mb-2">Tokenomics</h3>
                  <p className="text-muted-foreground">
                    Initial supply: 200,000 tokens | Launch price: $0.005 | Target value: $800 per token
                    <br />
                    Presale bonus: 10% extra tokens for early investors buying $50 or more
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-bold text-foreground mb-2">The Team</h3>
                  <p className="text-muted-foreground">
                    Led by experienced blockchain developers and gaming industry veterans committed to 
                    building the future of decentralized gaming entertainment.
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Full Whitepaper
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
