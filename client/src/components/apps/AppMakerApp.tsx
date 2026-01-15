import { useState } from "react";
import { AppTemplate } from "./AppTemplates";
import { PlusSquare, Save, Code, Layout, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AppMakerApp() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createApp = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/apps", {
        name,
        content,
        icon: "app-window",
        config: {}
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "App Created", description: `${name} has been added to your system.` });
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      setName("");
      setContent("");
    }
  });

  return (
    <AppTemplate title="App Maker" icon={PlusSquare}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
            <Layout className="w-4 h-4" /> App Name
          </label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Awesome App"
            className="bg-black/20 border-white/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
            <Code className="w-4 h-4" /> Content (HTML/Markdown)
          </label>
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter app content here..."
            className="h-64 font-mono text-sm bg-black/20 border-white/10"
          />
        </div>

        <Button 
          className="w-full h-12 gap-2" 
          onClick={() => createApp.mutate()}
          disabled={!name || !content || createApp.isPending}
        >
          <Save className="w-4 h-4" /> Create Application
        </Button>
      </div>
    </AppTemplate>
  );
}
