import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Desktop from "@/pages/Desktop";
import Login from "@/pages/Login";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

function AuthenticatedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <img src="/favicon.png" className="w-16 h-16 animate-pulse" alt="Logo" />
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="font-display tracking-widest text-sm text-white/50">AUTHENTICATING...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <AuthenticatedRoute component={Desktop} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
