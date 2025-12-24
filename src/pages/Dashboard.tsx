import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Database, Plus, ExternalLink, Loader2, CheckCircle2, Trash2, LogOut, User, AlertTriangle } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

import { Footer } from "@/components/Footer";
import { InitialLoader } from "@/components/InitialLoader";
import { createDatabase as apiCreateDb, getMyDatabase, openNeo4jBrowser } from "@/services/DBservice";

type DbInstance = {
  id: string;
  name: string;
  status: "creating" | "running";
  port: number; // bolt port
  httpPort?: number; // http browser port
};

export function Dashboard() {
  const navigate = useNavigate();
  const [instances, setInstances] = useState<DbInstance[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [password, setPassword] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutLoader, setShowLogoutLoader] = useState(false);
  const [instanceToDelete, setInstanceToDelete] = useState<DbInstance | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Load existing logged-in user (set by AuthForms on successful login)
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCreateDb = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password) {
      toast.error("Please enter a password to create a database.");
      return;
    }

    setIsCreating(true);
    setShowCreateForm(false);



    try {
      const res = await apiCreateDb({ neo4jPassword: password });
      setPassword("");
      if (!res.success || !res.data) {
        toast.error(res.message || "Failed to create database");
        setIsCreating(false);
        return;
      }
      const { boltPort, httpPort, containerName } = res.data;
      const id = Math.random().toString(36).slice(2, 9);
      const name = containerName || `db-${id}`;
      const newInstance: DbInstance = { id, name, status: "running", port: boltPort, httpPort };
      setInstances(prev => [...prev, newInstance]);
      toast.success(res.message || "Database is ready.");
    } catch (err) {
      toast.error("Network or server error");
    } finally {
      setIsCreating(false);
    }
  };

  const openNeo4j = async () => {
    // Prefer fetching current info in case ports change
    try {
      const res = await getMyDatabase();
      if (res.success && res.data?.httpPort) {
        openNeo4jBrowser(res.data.httpPort);
        return;
      }
      // Fallback: use first instance's httpPort if available
      const inst = instances.find(i => i.httpPort);
      if (inst?.httpPort) {
        openNeo4jBrowser(inst.httpPort);
      } else {
        toast.error("No database found to open");
      }
    } catch {
      toast.error("Unable to open Neo4j browser");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowLogoutLoader(true);
  };

  const finalizeLogout = () => {
    try {
      localStorage.removeItem("user");
    } catch {}
    setUser(null);
    setShowLogoutLoader(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const confirmDelete = () => {
    if (!instanceToDelete) return;
    setInstances(prev => prev.filter(i => i.id !== instanceToDelete.id));
    toast.success(`Database "${instanceToDelete.name}" deleted.`);
    setInstanceToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">CloudSynthex</span>
          </div>

          <div className="flex items-center space-x-4 relative">
            <button
              onClick={() => setShowUserMenu(s => !s)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 hover:opacity-90 transition-opacity focus:outline-none"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-60 rounded-md border border-border bg-popover p-3 shadow-lg z-50"
                >
                  <div className="flex items-center gap-3 p-1">
                    <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-medium">
                      {user ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "JD"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name ?? "Jane Developer"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email ?? "jane@cloudsynthex.dev"}</span>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-border/50 pt-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-red-400 hover:bg-accent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-1">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Create a database by entering a password (prototype).</p>
          </div>
          <Button onClick={() => setShowCreateForm(s => !s)} className="gap-2">
            <Plus className="w-4 h-4" /> New DB
          </Button>
        </header>

        <AnimatePresence>
          {showCreateForm && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mb-6">
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle>Create Database</CardTitle>
                  <CardDescription>Enter a password to proceed (prototype).</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateDb} className="flex items-end gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="dbpw">Admin Password</Label>
                      <Input id="dbpw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" />
                    </div>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {instances.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-xl bg-card">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No databases yet</h3>
              <p className="text-muted-foreground mb-4">Create one using the button above.</p>
              <Button variant="outline" onClick={() => setShowCreateForm(true)}>Create Database</Button>
            </div>
          )}

          {instances.map(inst => (
            <motion.div key={inst.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} layout>
              <Card className="border-border/50 bg-card hover:border-primary/50 transition-colors">
                <CardHeader className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{inst.name}</CardTitle>
                    <CardDescription className="text-xs font-mono text-muted-foreground">ID: {inst.id}</CardDescription>
                  </div>
                  <div>
                    {inst.status === "creating" ? (
                      <div className="flex items-center text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2 py-1 rounded-full">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Provisioning
                      </div>
                    ) : (
                      <div className="flex items-center text-green-500 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Running
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4 text-sm">
                    <div className="font-mono text-xs text-green-400">bolt://localhost:{inst.port}</div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button onClick={openNeo4j} className="flex-1 gap-2" disabled={inst.status !== "running"}>
                    Open DB <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" onClick={() => { setInstanceToDelete(inst); setShowDeleteModal(true); }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {showDeleteModal && instanceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm">
              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Delete Database</CardTitle>
                  <CardDescription>Are you sure you want to permanently delete "{instanceToDelete?.name}"?</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => { setShowDeleteModal(false); setInstanceToDelete(null); }}>Cancel</Button>
                  <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm">
              <Card className="border-border bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Confirm Sign Out</CardTitle>
                  <CardDescription>Are you sure you want to sign out of your account?</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleLogout}>Proceed</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showLogoutLoader && <InitialLoader duration={2600} onFinish={finalizeLogout} />}
    </div>
  );
}

 
