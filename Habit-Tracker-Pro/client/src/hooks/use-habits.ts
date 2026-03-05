import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/api";

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await authFetch("/api/habits");
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch habits");
      return res.json();
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await authFetch("/api/habits", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Success", description: "Habit created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, any>) => {
      const res = await authFetch(`/api/habits/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Success", description: "Habit updated" });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/habits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete habit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Deleted", description: "Habit has been removed" });
    },
  });
}

export function useLogHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      const res = await authFetch(`/api/habits/${id}/log`, {
        method: "POST",
        body: JSON.stringify({ date }),
      });
      if (!res.ok) throw new Error("Failed to log habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUnlogHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      const res = await authFetch(`/api/habits/${id}/log/${date}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to unlog habit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
