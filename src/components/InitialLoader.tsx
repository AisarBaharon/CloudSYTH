/*
  InitialLoader.tsx
  Full-screen intro loader that displays a circular progress indicator and
  percentage from 0 → 100. The spinner uses the app primary color so it
  visually integrates with the theme. Call `onFinish` when complete.
*/
import { useEffect, useState } from "react";

interface InitialLoaderProps {
  duration?: number; // total duration of the simulated load in ms
  onFinish?: () => void;
}

export function InitialLoader({ duration = 4200, onFinish }: InitialLoaderProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = 20; // update every 20ms
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setPercent(p);
      if (p >= 100) {
        clearInterval(t);
        // small hold so users see 100%
        setTimeout(() => onFinish && onFinish(), 250);
      }
    }, interval);

    return () => clearInterval(t);
  }, [duration, onFinish]);

  // Circle math (SVG)
  // increased radius slightly to match bigger spinner size
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36 text-primary" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              className="opacity-10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={String(dashOffset)}
              fill="none"
              className="transform -rotate-90 origin-center transition-[stroke-dashoffset] duration-150 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white">{percent}%</div>
            </div>
          </div>

          {/* Glitch overlay and scanlines that appear while loading (percent < 100) */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: percent < 100 ? 0.18 : 0,
              transition: "opacity 350ms ease",
            }}
          >
            <div className="loader-glitch" />
            <div className="glitch-lines" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Loading CloudSynthex…</div>
      </div>
    </div>
  );
}
