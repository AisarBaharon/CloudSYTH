/*
  Navbar.tsx
  Top navigation used on public pages (landing). Contains links to auth flows.
*/
import { Button } from "@/components/ui";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Database, Sparkles } from "lucide-react";

// Simple site navigation component
export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigate to landing and scroll to auth section; pass auth tab via query param
  const navigateToAuth = (tab: "login" | "register") => {
    const target = `/?auth=${tab}`;
    if (location.pathname !== "/" || location.search !== `?auth=${tab}`) {
      navigate(target);
      // allow navigation to settle then scroll
      setTimeout(() => {
        const element = document.getElementById("auth-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      const element = document.getElementById("auth-section");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
            CloudSynthex
          </span>
        </Link>
        
        {/* Only show these if not on dashboard (Dashboard has its own internal nav controls usually, but let's keep it simple) 
            Actually, Dashboard has its own nav in Dashboard.tsx. This Navbar is used in LandingPage.
            Wait, Navbar was used in LandingPage. Dashboard has its own nav structure hardcoded in Dashboard.tsx.
            So this Navbar is primarily for public facing pages.
        */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateToAuth("login")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign in
          </button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigateToAuth("register")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]"
          >
            <Sparkles className="w-4 h-4" />
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
