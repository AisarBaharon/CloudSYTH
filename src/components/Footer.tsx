/*
  Footer.tsx
  Simple site footer with branding and copyright line.
*/
import { Database } from "lucide-react";

// Footer component shown at the bottom of pages
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
            CloudSynthex
          </span>
        </div>

        <p className="text-gray-400 text-sm max-w-lg mt-6">
          Empowering developers to build the future with instant, secure, and scalable database containers.
        </p>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CloudSynthex Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
