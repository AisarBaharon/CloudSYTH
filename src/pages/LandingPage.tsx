/*
  LandingPage.tsx
  Public landing page with hero, features grid, and auth forms section.
*/
import { Button } from "@/components/ui";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Database, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AuthForms } from "@/components/AuthForms";
import { Footer } from "@/components/Footer";

// Landing page component
export function LandingPage() {
  // Smooth-scroll helper to the auth section
  const scrollToAuth = () => {
    const element = document.getElementById("auth-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20 flex-grow">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            The Next Gen <br />
            <span className="text-gradient-purple glow-primary">Database Creator</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            Deploy scalable Neo4j instances in seconds. Designed for modern developers who need speed, security, and reliability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <Button size="lg" onClick={scrollToAuth} className="h-14 px-8 text-lg gap-2">
              Create Project <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-8 mt-20 w-full"
          >
            {[
              {
                icon: Database,
                title: "Instant Deployment",
                desc: "Spin up Neo4j containers in less than 30 seconds."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Bank-grade encryption and automated backups included."
              },
              {
                icon: Zap,
                title: "High Performance",
                desc: "Optimized infrastructure for maximum query throughput."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className={
                  "p-6 rounded-2xl bg-black/40 border-border/50 shadow-2xl backdrop-blur-xl hover:border-primary/50 " +
                  "transition duration-200 ease-out text-left ring-4 ring-primary/25 shadow-[0_0_30px_rgba(147,51,234,0.14)]"
                }
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Auth Section */}
          <motion.div
            id="auth-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full mt-32 pt-10"
          >
             <h2 className="text-3xl font-bold mb-8">Get Started with CloudSynthex</h2>
             <AuthForms />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
