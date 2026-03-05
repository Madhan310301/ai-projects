import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";

export function useStats() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await authFetch("/api/dashboard");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await authFetch("/api/analytics");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });
}
