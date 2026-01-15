import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideIcon } from "lucide-react";

interface AppTemplateProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Standard Application Template
 * Use this to quickly create new "Lunix" apps.
 */
export function AppTemplate({ title, icon: Icon, children, actions }: AppTemplateProps) {
  return (
    <div className="flex flex-col h-full bg-background/50 text-foreground">
      {/* App Toolbar / Menu Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-secondary/50 border-b border-white/5">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium opacity-80">
            <Icon className="w-3.5 h-3.5" />
            <span>{title}</span>
          </div>
          <div className="flex gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <button className="hover:text-primary">File</button>
            <button className="hover:text-primary">Edit</button>
            <button className="hover:text-primary">View</button>
            <button className="hover:text-primary">Help</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {children}
          </div>
        </ScrollArea>
      </div>

      {/* App Status Bar */}
      <div className="px-3 py-0.5 bg-secondary/30 border-t border-white/5 text-[10px] opacity-50 flex justify-between">
        <span>Ready</span>
        <span>Items: 0</span>
      </div>
    </div>
  );
}

/**
 * Sidebar Application Template
 * For apps that need navigation like File Manager or Settings.
 */
export function SidebarAppTemplate({ 
  title, 
  icon: Icon, 
  sidebar, 
  children 
}: AppTemplateProps & { sidebar: React.ReactNode }) {
  return (
    <div className="flex h-full bg-background/50 text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-secondary/20 border-r border-white/5 flex flex-col">
        <div className="p-3 flex items-center gap-2 border-b border-white/5 bg-secondary/40">
           <Icon className="w-4 h-4 text-primary" />
           <span className="font-bold text-sm truncate">{title}</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sidebar}
          </div>
        </ScrollArea>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
