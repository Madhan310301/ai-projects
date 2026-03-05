import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Flame,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  Trophy,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useAnalytics } from "@/hooks/use-stats";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export function Analytics() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (<Skeleton key={i} className="h-28 rounded-2xl" />))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "Completed", value: data?.completedToday ?? 0 },
    { name: "Remaining", value: Math.max(0, (data?.totalHabits ?? 0) - (data?.completedToday ?? 0)) },
  ];
  const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  const productivityScore = data?.productivityScore ?? 0;
  const scoreColor = productivityScore >= 80 ? "text-emerald-400" : productivityScore >= 50 ? "text-amber-400" : "text-red-400";

  const statCards = [
    { label: "Productivity", value: `${productivityScore}`, suffix: "/100", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Completion Rate", value: `${data?.completionRate ?? 0}%`, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Current Streak", value: `${data?.currentStreak ?? 0}d`, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Best Streak", value: `${data?.bestStreak ?? 0}d`, icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Insights and trends to optimize your productivity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className={cn("relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md", stat.border, stat.bg)}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {"suffix" in stat && <span className="text-sm text-muted-foreground">{(stat as any).suffix}</span>}
                </div>
              </div>
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daily habit completion trend</p>
            </div>
            <Badge variant="outline" className="text-[10px]">Last 7 Days</Badge>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer>
              <BarChart data={data?.weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={28} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Completion Donut */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-2">Today&apos;s Progress</h3>
          <p className="text-xs text-muted-foreground mb-4">
            {data?.completedToday ?? 0} of {data?.totalHabits ?? 0} habits done
          </p>
          <div className="h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className={cn("text-3xl font-bold", scoreColor)}>{data?.completionRate ?? 0}%</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-base">30-Day Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Habit completion pattern over the last month</p>
          </div>
          <Badge variant="outline" className="text-[10px]">30 Days</Badge>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer>
            <AreaChart data={data?.monthlyData || []}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false}
                tickFormatter={(val: string) => {
                  const d = new Date(val);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval={4}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                labelFormatter={(val: string) => {
                  const d = new Date(val);
                  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                }}
              />
              <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" fill="url(#colorCompleted)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Lightbulb className="h-4 w-4 text-purple-400" />
            </div>
            <h3 className="font-bold text-base">Key Insights</h3>
          </div>
          <div className="space-y-3">
            {(data?.insights || []).length > 0 ? (
              data.insights.map((insight: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                  <ArrowUpRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{insight}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Start tracking habits to see insights.</p>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-base">Suggestions</h3>
          </div>
          <div className="space-y-2">
            {(data?.suggestions || []).length > 0 ? (
              data.suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No suggestions yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {data?.categories && Object.keys(data.categories).length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-base mb-4">Category Breakdown</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(data.categories).map(([cat, count]: [string, any]) => (
              <div key={cat} className="flex items-center gap-2 bg-secondary/30 border border-border rounded-xl px-4 py-2.5">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium capitalize">{cat}</span>
                <Badge variant="secondary" className="text-[10px]">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}