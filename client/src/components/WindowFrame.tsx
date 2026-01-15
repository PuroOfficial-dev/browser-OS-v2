import { useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { X, Minus, Square, Copy } from "lucide-react";
import { useWindowManager, type WindowState } from "@/hooks/use-window-manager";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export function WindowFrame({ window, children }: WindowFrameProps) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowManager();
  const nodeRef = useRef<HTMLDivElement>(null);

  const isActive = useWindowManager((s) => s.activeWindowId === window.id);

  // Focus on mount
  useEffect(() => {
    focusWindow(window.id);
  }, []);

  if (window.isMinimized) return null;

  return (
    <AnimatePresence>
      <Draggable
        handle=".window-handle"
        nodeRef={nodeRef}
        onStart={() => focusWindow(window.id)}
        disabled={window.isMaximized}
        defaultPosition={window.position}
      >
        <motion.div
          ref={nodeRef}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4 
          }}
          className={cn(
            "absolute flex flex-col bg-card rounded-lg overflow-hidden border border-white/10 window-shadow transition-all duration-200",
            window.isMaximized ? "inset-0 !transform-none rounded-none z-[50]" : "w-[800px] h-[500px]"
          )}
          style={{ zIndex: window.zIndex }}
          onClick={() => focusWindow(window.id)}
        >
          {/* Title Bar */}
          <motion.div 
            className={cn(
              "window-handle h-10 flex items-center justify-between px-3 select-none cursor-default",
              isActive ? "bg-card border-b border-white/5" : "bg-card/50 border-b border-white/5 text-muted-foreground"
            )}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <motion.span 
                className={cn("w-3 h-3 rounded-full", isActive ? "bg-primary" : "bg-muted-foreground/30")}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              />
              {window.title}
            </div>
            
            <div className="flex items-center gap-1">
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  window.isMaximized ? restoreWindow(window.id) : maximizeWindow(window.id); 
                }}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                {window.isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "rgb(239 68 68)", color: "white" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="flex-1 overflow-hidden relative bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </Draggable>
    </AnimatePresence>
  );
}
