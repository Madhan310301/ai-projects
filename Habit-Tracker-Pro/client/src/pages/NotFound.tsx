import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="h-20 w-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-yellow-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4 font-display">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
