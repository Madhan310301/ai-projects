import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Search,
  Bell,
  Menu,
  LayoutDashboard,
  Target,
  CheckSquare,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

const mobileNavItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Habits", path: "/habits", icon: Target },
  { name: "Tasks", path: "/todos", icon: CheckSquare },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

export function Navbar({ sidebarCollapsed }: { sidebarCollapsed?: boolean }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = (() => {
    switch (location) {
      case "/": return "Dashboard";
      case "/habits": return "Habits";
      case "/todos": return "Tasks";
      case "/analytics": return "Analytics";
      default: return "FocusFlow";
    }
  })();

  const currentDate = format(new Date(), "EEEE, MMMM d");

  return (
    <>
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {/* Mobile menu btn */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-lg font-bold">{pageTitle}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 pl-2 pr-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                    {user?.displayName?.[0] || user?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.displayName || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-6 px-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">FocusFlow</span>
            </div>
            {mobileNavItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}