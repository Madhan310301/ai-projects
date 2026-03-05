import { useState } from "react";
import { motion } from "framer-motion";
import { Check, MoreHorizontal, Edit, Trash2, Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLogHabit, useUnlogHabit, useDeleteHabit } from "@/hooks/use-habits";
import { HabitForm } from "./HabitForm";

interface HabitCardProps {
  habit: any;
}

export function HabitCard({ habit }: HabitCardProps) {
  const logMutation = useLogHabit();
  const unlogMutation = useUnlogHabit();
  const deleteMutation = useDeleteHabit();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const today = format(new Date(), "yyyy-MM-dd");
  const isCompletedToday = habit.logs.some(log => log.date === today);
  const isPending = logMutation.isPending || unlogMutation.isPending;

  const toggleLog = () => {
    if (isCompletedToday) {
      unlogMutation.mutate({ id: habit._id, date: today });
    } else {
      logMutation.mutate({ id: habit._id, date: today });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteMutation.mutate(habit._id);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
          isCompletedToday && "border-primary/50 bg-primary/5"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="block h-2.5 w-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: habit.color || '#3b82f6' }}
              />
              <h3 className={cn(
                "font-bold text-lg truncate transition-colors",
                isCompletedToday ? "text-primary" : "text-foreground"
              )}>
                {habit.name}
              </h3>
            </div>
            {habit.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {habit.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="capitalize">{habit.frequency}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                <span className="text-primary font-bold">{habit.streak}</span> 
                <span>streak</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={toggleLog}
              disabled={isPending}
              className={cn(
                "mt-2 h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300",
                isCompletedToday 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-100" 
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:scale-105",
                isPending && "opacity-50 cursor-not-allowed"
              )}
            >
              {isCompletedToday ? (
                <Check className="h-6 w-6 stroke-[3]" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-current opacity-50" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar background for visual flair */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-primary/20 transition-all duration-500"
          style={{ width: `${Math.min(habit.completionRate, 100)}%` }}
        />
      </motion.div>

      <HabitForm 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        habit={habit}
      />
    </>
  );
}
