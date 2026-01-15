import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertSettings } from "@shared/routes";

export function useSettings() {
  return useQuery({
    queryKey: [api.settings.get.path],
    queryFn: async () => {
      const res = await fetch(api.settings.get.path);
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.settings.get.responses[200].parse(await res.json());
    },
    // Keep settings fresh to reflect changes immediately across components if needed
    staleTime: 1000 * 60, 
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<InsertSettings>) => {
      // Clean undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      const res = await fetch(api.settings.update.path, {
        method: api.settings.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanUpdates),
      });
      
      if (!res.ok) throw new Error("Failed to update settings");
      return api.settings.update.responses[200].parse(await res.json());
    },
    onSuccess: (newSettings) => {
      // Update the cache immediately with the new settings
      queryClient.setQueryData([api.settings.get.path], newSettings);
      
      // Also invalidate to be safe
      queryClient.invalidateQueries({ queryKey: [api.settings.get.path] });
    },
  });
}
