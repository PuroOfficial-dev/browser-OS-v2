import { useWindowManager } from "@/hooks/use-window-manager";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Menu, Wifi, Volume2, Battery, Terminal, Settings, Globe, Folder, Calculator, Calendar, PlusSquare, User, LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { appShortcuts } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const ICON_MAP: Record<string, any> = {
  terminal: Terminal,
  settings: Settings,
  browser: Globe,
  files: Folder,
  calculator: Calculator,
  "app-maker": PlusSquare
};

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow, openWindow } = useWindowManager();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-12 bg-card/95 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-2 relative z-[1000] select-none shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.3)]">
      
      {/* LEFT: Start Menu & Quick Launch */}
      <div className="flex items-center gap-2 h-full">
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <motion.button 
              className={cn(
                "h-9 px-3 rounded flex items-center gap-2 transition-all duration-200 border border-transparent",
                isStartOpen 
                  ? "bg-primary/20 text-primary border-primary/20" 
                  : "hover:bg-white/5 hover:text-primary active:scale-95 text-foreground/80"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ rotate: isStartOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <img src="/favicon.png" alt="Lunix" className="w-5 h-5" />
              <span className="font-bold tracking-tight text-sm hidden sm:block">Menu</span>
            </motion.button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="start" 
            sideOffset={12} 
            className="w-80 p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl rounded-tr-xl rounded-tl-none rounded-br-none"
          >
            <div className="flex h-[400px]">
              {/* Sidebar Category Strip */}
              <div className="w-12 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-black/20">
                <button className="p-2 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                  <Folder className="w-5 h-5" />
                </button>
                <div className="flex-1" />
                <button className="p-2 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                  <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent" />
                </button>
              </div>

              {/* App List */}
              <div className="flex-1 py-2">
                <div className="px-4 py-3 border-b border-white/5">
                  <input 
                    placeholder="Search..." 
                    className="w-full bg-black/20 border border-white/5 rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="p-2 space-y-1">
                  {appShortcuts.map((app) => {
                    const Icon = ICON_MAP[app.id];
                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          openWindow(app.id, app.name);
                          setIsStartOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">{app.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Window List */}
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {windows.map((w) => {
              const isActive = activeWindowId === w.id && !w.isMinimized;
              const Icon = ICON_MAP[w.appId] || Terminal;
              
              return (
                <motion.button
                  key={w.id}
                  onClick={() => {
                    if (isActive) minimizeWindow(w.id);
                    else if (w.isMinimized) restoreWindow(w.id);
                    else focusWindow(w.id);
                  }}
                  className={cn(
                    "h-9 px-3 rounded flex items-center gap-2 min-w-[140px] max-w-[200px] border transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-white/10 border-white/10 shadow-inner" 
                      : "hover:bg-white/5 border-transparent hover:border-white/5"
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="text-sm truncate text-left flex-1 font-medium opacity-90">{w.title}</span>
                  
                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: System Tray */}
      <div className="flex items-center gap-2 h-full pl-4">
        <div className="flex items-center gap-1 px-2">
          <TrayIcon icon={Wifi} />
          <TrayIcon icon={Volume2} />
          <TrayIcon icon={Battery} className="rotate-90" />
        </div>
        
        <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <PopoverTrigger asChild>
            <motion.button 
              className="flex items-center gap-2 px-3 py-1 rounded hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground/80 max-w-[100px] truncate">
                {user?.displayName || user?.username}
              </span>
            </motion.button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="end" 
            sideOffset={12} 
            className="w-48 p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl"
          >
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
                </div>
              </div>
            </div>
            <div className="p-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex flex-col items-end justify-center px-3 hover:bg-white/5 h-full cursor-default transition-colors rounded">
          <span className="text-xs font-bold leading-tight">{format(time, 'HH:mm')}</span>
          <span className="text-[10px] text-muted-foreground leading-tight">{format(time, 'MMM d, yyyy')}</span>
        </div>
        
        <button 
          className="h-full w-1.5 border-l border-white/10 hover:bg-white/10 transition-colors ml-1"
          title="Show Desktop"
          onClick={() => {
            // Minimize all windows logic could go here
          }}
        />
      </div>
    </div>
  );
}

function TrayIcon({ icon: Icon, className }: { icon: any, className?: string }) {
  return (
    <div className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-default">
      <Icon className={cn("w-4 h-4", className)} />
    </div>
  );
}
