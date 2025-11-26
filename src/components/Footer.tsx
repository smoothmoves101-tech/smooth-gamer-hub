import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border bg-card/30 backdrop-blur">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-glow">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">The Smooth Gamer</p>
              <p className="text-sm text-muted-foreground">Powered by SMOOTH Token</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground mb-2">
              Built on Polygon Network
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 The Smooth Gamer. All rights reserved.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-4">
            <Link 
              to="/admin" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Dashboard
            </Link>
            <p className="text-xs text-muted-foreground text-center">
              Disclaimer: Cryptocurrency investments carry risk. Please do your own research before investing.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
