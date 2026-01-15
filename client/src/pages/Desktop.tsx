import { useEffect, lazy, Suspense, useState } from "react";
import { useSettings } from "@/hooks/use-settings";
import { useWindowManager } from "@/hooks/use-window-manager";
import { Taskbar } from "@/components/Taskbar";
import { DesktopIcon } from "@/components/DesktopIcon";
import { WindowFrame } from "@/components/WindowFrame";
import { appShortcuts } from "@shared/schema";
import { CustomApp } from "@shared/schema";
import { Terminal, Settings, Globe, Folder, Calculator, PlusSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic app loader - only loads when needed
const loadAppComponent = (appId: string) => {
  switch (appId) {
    case 'terminal':
      return lazy(() => import("@/components/apps/TerminalApp").then(module => ({ default: module.TerminalApp })));
    case 'settings':
      return lazy(() => import("@/components/apps/SettingsApp").then(module => ({ default: module.SettingsApp })));
    case 'files':
      return lazy(() => import("@/components/apps/FilesApp").then(module => ({ default: module.FilesApp })));
    case 'browser':
      return lazy(() => import("@/components/apps/BrowserApp").then(module => ({ default: module.BrowserApp })));
    case 'calculator':
      return lazy(() => import("@/components/apps/CalculatorApp").then(module => ({ default: module.CalculatorApp })));
    case 'app-maker':
      return lazy(() => import("@/components/apps/AppMakerApp").then(module => ({ default: module.AppMakerApp })));
    default:
      return null;
  }
};

// Mapping icons for desktop shortcuts
const ICON_MAP: Record<string, any> = {
  terminal: Terminal,
  settings: Settings,
  browser: Globe,
  files: Folder,
  calculator: Calculator,
  "app-maker": PlusSquare
};

const DynamicApp = ({ appData }: { appData?: any }) => {
  return (
    <div className="h-full bg-background p-4 overflow-auto prose prose-invert max-w-none">
      <div dangerouslySetInnerHTML={ { __html: appData.content } } />
    </div>
  );
};

export default function Desktop() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { windows, openWindow } = useWindowManager();
  const { data: customApps, isLoading: appsLoading } = useQuery<CustomApp[]>({
    queryKey: ["/api/apps"],
  });

  // Apply cursor style to body
  useEffect(() => {
    if (settings?.cursorStyle) {
      document.body.className = `cursor-${settings.cursorStyle}`;
    }
  }, [settings?.cursorStyle]);

  if (settingsLoading || !settings) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <img src="/favicon.png" className="w-20 h-20" alt="Logo" />
            <motion.div
              className="absolute inset-0 border-2 border-primary/50 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-white mb-2">LUNIX OS</h1>
            <p className="text-slate-400 text-sm">Initializing your desktop environment...</p>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.6, duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-screen w-screen overflow-hidden flex flex-col relative select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      
      {/* Wallpaper Layer */}
      <motion.div 
        className="absolute inset-0 -z-20 bg-black"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {settings.wallpaperType === 'video' ? (
          settings.wallpaperUrl.toLowerCase().endsWith('.gif') || !settings.wallpaperUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <img 
              src={settings.wallpaperUrl} 
              alt="Wallpaper" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              src={settings.wallpaperUrl} 
              key={settings.wallpaperUrl}
              className="w-full h-full object-cover opacity-80"
              autoPlay 
              loop 
              muted 
            />
          )
        ) : (
          <img 
            src={settings.wallpaperUrl} 
            alt="Wallpaper" 
            className="w-full h-full object-cover"
          />
        )}
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Desktop Area */}
      <div className="flex-1 relative p-4" id="desktop-area">
        {/* Grid of Icons */}
        <motion.div 
          className="grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 w-fit h-full content-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatePresence>
            {appShortcuts.map((shortcut, index) => (
              <motion.div
                key={shortcut.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.1,
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <DesktopIcon 
                  name={shortcut.name}
                  icon={ICON_MAP[shortcut.id]}
                  onClick={() => openWindow(shortcut.id, shortcut.name)}
                />
              </motion.div>
            ))}
            {customApps?.map((app: any, index) => (
              <motion.div
                key={`custom-${app.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.5 + (appShortcuts.length + index) * 0.1,
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <DesktopIcon 
                  name={app.name}
                  icon={PlusSquare}
                  onClick={() => openWindow(`custom-${app.id}`, app.name)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Windows Layer */}
        {windows.map((window) => {
          let AppComponent = null;
          let appProps = {};
          
          if (window.appId.startsWith("custom-")) {
            const appId = parseInt(window.appId.split("-")[1]);
            const appData = customApps?.find((a: any) => a.id === appId);
            if (appData) {
              appProps = { appData };
            }
          } else {
            AppComponent = loadAppComponent(window.appId);
          }

          return (
            <WindowFrame key={window.id} window={window}>
              {AppComponent ? (
                <Suspense fallback={
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                }>
                  <AppComponent {...appProps} />
                </Suspense>
              ) : window.appId.startsWith("custom-") ? (
                <DynamicApp {...appProps} />
              ) : null}
            </WindowFrame>
          );
        })}
      </div>

      {/* Taskbar */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <Taskbar />
      </motion.div>
    </motion.div>
  );
}
