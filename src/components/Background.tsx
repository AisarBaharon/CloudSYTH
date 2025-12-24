/*
  Background.tsx
  Global decorative background for the app (image layer, animated orbs, and grid overlay).
  This component is fixed behind the main app content.
*/
import { motion } from "framer-motion";

// Renders the layered, animated background used across pages
export function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Background image layer (behind the animated orbs) */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none z-0"
        style={{ backgroundImage: "url('/dbbackground.png')", backgroundSize: '100%' }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.85, 0.5],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] z-10"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.45, 0.75, 0.45],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] z-10"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] z-10"
      />

      {/* Grid pattern overlay (near-invisible) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-20"
      />
    </div>
  );
}
