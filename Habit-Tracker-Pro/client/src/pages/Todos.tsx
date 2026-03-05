import { useState, useMemo } from "react";
import { TodoForm } from "@/components/TodoForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Check,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Clock,
  ListTodo,
  Filter,
} from "lucide-react";
import { useTodos, useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const priorityConfig: Record<string, { label: string; color: string; icon: any }> = {
  urgent: { label: "Urgent", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertCircle },
  high: { label: "High", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: AlertCircle },
  medium: { label: "Medium", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock },
  low: { label: "Low", color: "text-slate-400 bg-slate-500/10 border-slate-500/20", icon: Clock },
};

export function Todos() {
  const { data: todosData, isLoading } = useTodos();
  const todos = useMemo(() => todosData ?? [], [todosData]);
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredTodos = useMemo(() => {
    let filtered = [...todos];
    if (filterPriority !== "all") {
      filtered = filtered.filter((t: any) => t.priority === filterPriority);
    }
    if (!showCompleted) {
      filtered = filtered.filter((t: any) => !t.completed);
    }
    // Sort: uncompleted first, then by priority
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a: any, b: any) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    });
    return filtered;
  }, [todos, filterPriority, showCompleted]);

  const groupedTodos = useMemo(() => ({
    daily: filteredTodos.filter((t: any) => t.type === "daily"),
    weekly: filteredTodos.filter((t: any) => t.type === "weekly"),
    monthly: filteredTodos.filter((t: any) => t.type === "monthly"),
  }), [filteredTodos]);

  const todoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t: any) => t.completed).length;
    return { total, completed, pending: total - completed };
  }, [todos]);

  const toggleComplete = (todo: any) => {
    updateMutation.mutate({ id: todo._id, completed: !todo.completed });
  };

  const handleDelete = (todo: any) => {
    if (confirm(`Delete "${todo.title}"?`)) {
      deleteMutation.mutate(todo._id);
    }
  };

  const renderTodoItem = (todo: any) => {
    const priority = priorityConfig[todo.priority || "medium"];

    return (
      <div
        key={todo._id}
        className={cn(
          "group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
          todo.completed
            ? "bg-secondary/20 border-border/50 opacity-60"
            : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
        )}
      >
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(todo)}
          className={cn(
            "mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
            todo.completed
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-sm font-medium",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </span>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 border", priority.color)}>
              {priority.label}
            </Badge>
          </div>
          {todo.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{todo.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            {todo.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(todo.dueDate), "MMM d")}
              </span>
            )}
            {todo.tags?.length > 0 && (
              <div className="flex items-center gap-1">
                {todo.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => {
              setEditingTodo(todo);
              setIsCreateOpen(true);
            }}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => handleDelete(todo)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {todoStats.pending} pending &middot; {todoStats.completed} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showCompleted ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs"
          >
            <Filter className="mr-1.5 h-3 w-3" />
            {showCompleted ? "Hide Done" : "Show Done"}
          </Button>
          <Button
            onClick={() => {
              setEditingTodo(null);
              setIsCreateOpen(true);
            }}
            className="bg-gradient-to-r from-primary to-purple-600"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: todoStats.total, icon: ListTodo, color: "text-blue-400 bg-blue-500/10" },
          { label: "Completed", value: todoStats.completed, icon: Check, color: "text-emerald-400 bg-emerald-500/10" },
          { label: "Pending", value: todoStats.pending, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl h-auto">
          {["daily", "weekly", "monthly"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="capitalize rounded-lg px-5 py-2 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab}
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 h-4">
                {groupedTodos[tab as keyof typeof groupedTodos].length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {isLoading ? (
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          ["daily", "weekly", "monthly"].map((type) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="space-y-2">
                {groupedTodos[type as keyof typeof groupedTodos].length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-card/50">
                    <ListTodo className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No {type} tasks</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setEditingTodo(null);
                        setIsCreateOpen(true);
                      }}
                    >
                      Add a task
                    </Button>
                  </div>
                ) : (
                  groupedTodos[type as keyof typeof groupedTodos].map((todo: any) =>
                    renderTodoItem(todo)
                  )
                )}
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>

      <TodoForm
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setEditingTodo(null);
        }}
        todo={editingTodo ?? undefined}
      />
    </div>
  );
}