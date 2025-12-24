/*
  AuthForms.tsx
  Combined Sign Up and Sign In forms used on the landing page.
  - Provides simple client-side validation and simulated submit handlers for demo.
*/
import { useState, useEffect } from "react";
import { Button, Input, Label, Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { login as apiLogin, register as apiRegister } from "@/services/authService";

// Main component: combined register/login UI with simple client-side validation
export function AuthForms() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const location = window.location; // simple access for initial parse

  // Read `?auth=` query param and set the active tab accordingly on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const auth = params.get("auth");
      if (auth === "login") setActiveTab("login");
      if (auth === "register") setActiveTab("register");
    } catch (e) {
      // ignore parsing errors for the demo
    }
  }, [location.search]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states for login and register
  // Login uses email + password (no username) per requirement
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", password: "" });

  // Input change handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Simple validators used by the demo forms
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // No password complexity enforced for demo - accept any non-empty password

  // Demo submit handlers: perform validation, then navigate or switch tab on success
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Require email + password for login
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(loginData.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Call backend login
    try {
      const res = await apiLogin({ email: loginData.email, password: loginData.password });
      if (!res.success) {
        toast.error(res.message || "Login failed");
        setIsLoading(false);
        return;
      }
      // Persist minimal user info used by Dashboard/User Menu
      try {
        localStorage.setItem("user", JSON.stringify({ email: loginData.email }));
      } catch {}
      toast.success(res.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Network or server error");
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!registerData.email || !registerData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(registerData.email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    // No complexity checks for passwords in this demo app

    // Call backend register
    try {
      const res = await apiRegister({ email: registerData.email, password: registerData.password });
      setIsLoading(false);
      if (!res.success) {
        toast.error(res.message || "Registration failed");
        return;
      }
      toast.success(res.message || "Account created successfully!");
      setActiveTab("login");
    } catch (err) {
      setIsLoading(false);
      toast.error("Network or server error");
    }
  };

  // Render the combined form UI
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex w-full mb-6 p-1 bg-white/5 rounded-lg border border-white/10">
        <button
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "register" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "login" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border/50 shadow-2xl backdrop-blur-xl bg-black/40">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {activeTab === "register" ? "Create an account" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "register" 
                  ? "Enter your details below to create your account" 
                  : "Enter your credentials to access your dashboard"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === "register" ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                 
                  <div className="space-y-2 text-left">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        disabled={isLoading}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* No complexity requirements shown */}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create account
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        disabled={isLoading}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
        {/*
          Themed full-page circular loader shown while a login request is in progress.
          We show this overlay only for the login flow so the user sees a transition
          between the landing page and the dashboard.
        */}
        {isLoading && activeTab === "login" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              {/* SVG circular spinner using currentColor so `text-primary` applies the theme color */}
              <svg className="animate-spin w-16 h-16 text-primary" viewBox="0 0 50 50" aria-hidden>
                <circle
                  className="opacity-20"
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  className="opacity-100"
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="31.4 62.8"
                  fill="none"
                />
              </svg>
              <div className="text-sm text-gray-200">Signing in…</div>
            </div>
          </div>
        )}
    </div>
  );
}
