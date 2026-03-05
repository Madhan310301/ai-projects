import { useState } from "react";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TodoForm } from "./TodoForm";

export function TodoItem({ todo }: { todo: any }) {
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleComplete = (checked: boolean) => {
    updateMutation.mutate({ id: todo._id, completed: checked });
  };

  const handleDelete = () => {
    if (confirm("Delete this task?")) {
      deleteMutation.mutate(todo._id);
    }
  };

  return (
    <>
      <div className={cn(
        "group flex items-center justify-between p-4 mb-3 rounded-xl border bg-card transition-all duration-200",
        todo.completed 
          ? "border-border/50 bg-secondary/30 opacity-70" 
          : "border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
      )}>
        <div className="flex items-center gap-4 flex-1">
          <Checkbox 
            checked={todo.completed || false} 
            onCheckedChange={toggleComplete}
            className="w-5 h-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className={cn(
            "font-medium transition-all duration-200",
            todo.completed && "line-through text-muted-foreground"
          )}>
            {todo.task}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditOpen(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TodoForm 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        todo={todo}
      />
    </>
  );
}
