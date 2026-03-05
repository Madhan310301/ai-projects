import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuth();
  const currentDate = format(new Date(), "EEEE, MMMM do");

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-foreground">{currentDate}</p>
          <p className="text-xs text-muted-foreground">Welcome back, {user?.displayName || "User"}</p>
        </div>
        <Avatar className="h-10 w-10 ring-2 ring-border">
          <AvatarImage src={user?.photoURL || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary font-bold">
            {user?.displayName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
