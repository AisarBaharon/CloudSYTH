/*
  App.tsx
  Main application router and root component.
  Defines top-level routes and mounts global UI such as the background and toaster.
*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { Background } from "@/components/Background";
import { Toaster } from "sonner";
import { useState } from "react";
import { InitialLoader } from "@/components/InitialLoader";

// Root app component which defines client routes and global UI elements.
export function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  // Show initial loader before rendering the app pages
  if (!loadingDone) {
    return <InitialLoader onFinish={() => setLoadingDone(true)} />;
  }

  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster position="top-center" richColors theme="dark" />
    </BrowserRouter>
  );
}
