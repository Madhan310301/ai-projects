import { useState, useMemo } from "react";
import { HabitForm } from "@/components/HabitForm";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Flame,
  Check,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react";
import { useHabits, useLogHabit, useUnlogHabit, useDeleteHabit } from "@/hooks/use-habits";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Habits() {
  const { data: habitsData, isLoading } = useHabits();
  const habits = useMemo(() => habitsData ?? [], [habitsData]);
  const logMutation = useLogHabit();
  const unlogMutation = useUnlogHabit();
  const deleteMutation = useDeleteHabit();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const activeHabits = useMemo(
    () => habits.filter((h: any) => !h.archived),
    [habits]
  );

  // Auto-select first habit
  const displayHabit = selectedHabit || activeHabits[0];

  const today = format(new Date(), "yyyy-MM-dd");

  const toggleLog = (habit: any, date?: string) => {
    const d = date || today;
    const isCompleted = (habit.logs || []).includes(d);
    if (isCompleted) {
      unlogMutation.mutate({ id: habit._id, date: d });
    } else {
      logMutation.mutate({ id: habit._id, date: d });
    }
  };

  const handleDelete = (habit: any) => {
    if (window.confirm(`Delete "${habit.name}"?`)) {
      deleteMutation.mutate(habit._id);
      if (selectedHabit?._id === habit._id) setSelectedHabit(null);
    }
  };

  // Calendar data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Habits</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeHabits.length} active habit{activeHabits.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingHabit(null);
            setIsCreateOpen(true);
          }}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Habit List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your Habits
            </h3>
          </div>

          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {activeHabits.length === 0 ? (
              <div className="p-8 text-center">
                <Target className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No habits yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create your first habit
                </Button>
              </div>
            ) : (
              activeHabits.map((habit: any) => {
                const isActive = displayHabit?._id === habit._id;
                const isCompleted = (habit.logs || []).includes(today);
                const streak = habit.streak ?? 0;

                return (
                  <div
                    key={habit._id}
                    onClick={() => setSelectedHabit(habit)}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer transition-all",
                      isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/30 border-l-2 border-l-transparent"
                    )}
                  >
                    {/* Check button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLog(habit);
                      }}
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                        isCompleted
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border-2 border-current" />
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color || "#8b5cf6" }}
                        />
                        <span className={cn(
                          "text-sm font-medium truncate",
                          isCompleted && "line-through text-muted-foreground"
                        )}>
                          {habit.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {habit.frequency || "daily"}
                        </Badge>
                        {streak > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-medium">
                            <Flame className="h-3 w-3" /> {streak}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingHabit(habit);
                          setIsCreateOpen(true);
                        }}>
                          <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(habit)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel - Calendar & Details */}
        <div className="lg:col-span-2 space-y-6">
          {displayHabit ? (
            <>
              {/* Habit Detail Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: displayHabit.color || "#8b5cf6" }}
                    />
                    <h3 className="text-xl font-bold">{displayHabit.name}</h3>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {displayHabit.frequency || "daily"}
                  </Badge>
                </div>
                {displayHabit.description && (
                  <p className="text-sm text-muted-foreground mb-4">{displayHabit.description}</p>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{displayHabit.streak ?? 0}</p>
                    <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
                      Current Streak
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{(displayHabit.logs || []).length}</p>
                    <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
                      Total Logs
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{displayHabit.completionRate ?? 0}%</p>
                    <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">
                      Rate (30d)
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={displayHabit.completionRate ?? 0} className="h-1.5" />
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                      className="text-xs"
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month start */}
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {daysInMonth.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const isLogged = (displayHabit.logs || []).includes(dateStr);
                    const isTodayDate = isToday(day);
                    const isFuture = day > new Date();

                    return (
                      <button
                        key={dateStr}
                        disabled={isFuture}
                        onClick={() => !isFuture && toggleLog(displayHabit, dateStr)}
                        className={cn(
                          "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all relative",
                          isLogged
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-secondary/60",
                          isTodayDate && !isLogged && "ring-2 ring-primary/50",
                          isFuture && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        {format(day, "d")}
                        {isLogged && (
                          <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Select a habit</h3>
              <p className="text-sm text-muted-foreground">
                Choose a habit from the list to view its calendar and details.
              </p>
            </div>
          )}
        </div>
      </div>

      <HabitForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        habit={editingHabit ?? undefined}
      />
    </div>
  );
}