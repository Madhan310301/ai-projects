import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateHabit, useUpdateHabit } from "@/hooks/use-habits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HabitData {
  name: string;
  description: string;
  frequency: string;
  color: string;
  category: string;
}

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: any;
}

export function HabitForm({ open, onOpenChange, habit }: HabitFormProps) {
  const createMutation = useCreateHabit();
  const updateMutation = useUpdateHabit();
  const isEditing = !!habit;

  const form = useForm<HabitData>({
    defaultValues: {
      name: "",
      description: "",
      frequency: "daily",
      color: "#3b82f6",
      category: "general",
    },
  });

  useEffect(() => {
    if (habit) {
      form.reset({
        name: habit.name || "",
        description: habit.description || "",
        frequency: habit.frequency || "daily",
        color: habit.color || "#3b82f6",
        category: habit.category || "general",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        frequency: "daily",
        color: "#3b82f6",
        category: "general",
      });
    }
  }, [habit, form, open]);

  const onSubmit = async (data: HabitData) => {
    try {
      if (isEditing && habit) {
        await updateMutation.mutateAsync({ id: habit._id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch {
      // Error handling is done in hooks
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your habit details below." : "Start building a new positive habit today."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Habit name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Meditation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why is this important?"
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Tag</FormLabel>
                  <div className="flex gap-2 items-center mt-2">
                    <Input type="color" className="w-12 h-10 p-1" {...field} />
                    <span className="text-xs text-muted-foreground">{field.value}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditing ? "Update Habit" : "Create Habit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
