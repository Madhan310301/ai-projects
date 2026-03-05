import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Habits", path: "/habits", icon: Target },
  { name: "Tasks", path: "/todos", icon: CheckSquare },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 relative",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
                FocusFlow
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-3">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const isActive = location === item.path;
          const linkContent = (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group/item",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground"
                  )}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("w-full", collapsed ? "px-0 justify-center" : "justify-start")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
