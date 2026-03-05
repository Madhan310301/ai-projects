import { useMemo, useState } from "react";
import { HabitForm } from "@/components/HabitForm";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Target,
  Flame,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Check,
} from "lucide-react";
import { useStats } from "@/hooks/use-stats";
import { useLogHabit, useUnlogHabit } from "@/hooks/use-habits";
import { Link } from "wouter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function Dashboard() {
  const { data: stats, isLoading } = useStats();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const logMutation = useLogHabit();
  const unlogMutation = useUnlogHabit();

  const today = format(new Date(), "yyyy-MM-dd");

  const activeHabits = useMemo(() => {
    return (stats?.habits || []).filter((h: any) => !h.archived);
  }, [stats]);

  const toggleLog = (habit: any) => {
    const isCompleted = (habit.logs || []).includes(today);
    if (isCompleted) {
      unlogMutation.mutate({ id: habit._id, date: today });
    } else {
      logMutation.mutate({ id: habit._id, date: today });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Habits",
      value: stats?.totalHabits ?? 0,
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Completed Today",
      value: `${stats?.completedToday ?? 0}/${stats?.totalHabits ?? 0}`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Current Streak",
      value: `${stats?.currentStreak ?? 0}d`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "Completion Rate",
      value: `${stats?.completionRate ?? 0}%`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here&apos;s your productivity overview for today.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md",
              stat.border,
              stat.bg
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Habits completed per day</p>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer>
              <BarChart data={stats?.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Habits Quick View */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base">Today&apos;s Habits</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stats?.completedToday ?? 0} of {stats?.totalHabits ?? 0} done
              </p>
            </div>
            <Link href="/habits">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <Progress
              value={stats?.completionRate ?? 0}
              className="h-2"
            />
          </div>

          {/* Habit list */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {activeHabits.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No habits yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create one
                </Button>
              </div>
            ) : (
              activeHabits.slice(0, 8).map((habit: any) => {
                const isCompleted = (habit.logs || []).includes(today);
                return (
                  <div
                    key={habit._id}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer",
                      isCompleted
                        ? "bg-primary/5 border border-primary/20"
                        : "hover:bg-secondary/50 border border-transparent"
                    )}
                    onClick={() => toggleLog(habit)}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isCompleted && "text-muted-foreground line-through"
                        )}
                      >
                        {habit.name}
                      </p>
                    </div>
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: habit.color || "#8b5cf6" }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Task Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-sm font-medium">Total Tasks</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalTodos ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats?.completedTodos ?? 0} completed
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-sm font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold">{stats?.pendingTodos ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">tasks remaining</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Flame className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium">Best Streak</span>
          </div>
          <p className="text-2xl font-bold">{stats?.bestStreak ?? 0} days</p>
          <p className="text-xs text-muted-foreground mt-1">all-time record</p>
        </div>
      </div>

      <HabitForm open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}