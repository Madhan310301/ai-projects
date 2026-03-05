import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { Landing } from "@/pages/Landing";
import { Dashboard } from "@/pages/Dashboard";
import { Habits } from "@/pages/Habits";
import { Todos } from "@/pages/Todos";
import { Analytics } from "@/pages/Analytics";
import { NotFound } from "@/pages/NotFound";
import { useAuth } from "@/hooks/use-auth";

function AuthenticatedRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/habits" component={Habits} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/todos" component={Todos} />
        <Route path="/" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading FocusFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return <AuthenticatedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;