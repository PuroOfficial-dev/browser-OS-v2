import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { Loader2, Monitor, MousePointer, PaintBucket, Image as ImageIcon, Video, Upload, Layout, CheckSquare, Zap, Type, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";

const THEME_COLORS = [
  "#87cf3e", // Mint
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#ec4899", // Pink
];

const FONT_FAMILIES = [
  { value: "default", label: "System Default", class: "font-sans" },
  { value: "mono", label: "Monospace", class: "font-mono" },
  { value: "serif", label: "Serif", class: "font-serif" },
  { value: "sans", label: "Sans Serif", class: "font-sans" },
];

export function SettingsApp() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      updateSettings.mutate({ 
        wallpaperUrl: data.url,
        wallpaperType: file.type.startsWith("video") || file.name.endsWith(".gif") ? "video" : "image"
      });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="p-6 pb-2 border-b border-white/5">
        <h2 className="text-2xl font-display font-light">System Settings</h2>
        <p className="text-muted-foreground text-sm">Customize your desktop environment</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Appearance Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Appearance
          </h3>
          
          <div className="bg-card rounded-lg border border-white/5 p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wallpaper URL or Upload</label>
              <div className="flex gap-2">
                <input 
                  defaultValue={settings.wallpaperUrl}
                  onBlur={(e) => updateSettings.mutate({ wallpaperUrl: e.target.value })}
                  className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="https://..."
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*,.gif"
                  onChange={handleUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-2 bg-secondary rounded border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50"
                  title="Upload GIF or Video"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wallpaper Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings.mutate({ wallpaperType: 'image' })}
                  className={cn(
                    "flex-1 py-2 rounded border transition-all flex items-center justify-center gap-2 text-sm",
                    settings.wallpaperType === 'image' 
                      ? "bg-primary/20 border-primary text-primary font-medium" 
                      : "bg-transparent border-white/10 hover:bg-white/5"
                  )}
                >
                  <ImageIcon className="w-4 h-4" /> Image
                </button>
                <button
                  onClick={() => updateSettings.mutate({ wallpaperType: 'video' })}
                  className={cn(
                    "flex-1 py-2 rounded border transition-all flex items-center justify-center gap-2 text-sm",
                    settings.wallpaperType === 'video' 
                      ? "bg-primary/20 border-primary text-primary font-medium" 
                      : "bg-transparent border-white/10 hover:bg-white/5"
                  )}
                >
                  <Video className="w-4 h-4" /> Video/GIF
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-4 h-4" /> Layout
          </h3>
          <div className="bg-card rounded-lg border border-white/5 p-4 space-y-4">
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                   <label className="text-sm font-medium">Taskbar Position</label>
                   <p className="text-xs text-muted-foreground">Move the panel to top or bottom</p>
                </div>
                <select 
                  value={settings.taskbarPosition || "bottom"}
                  onChange={(e) => updateSettings.mutate({ taskbarPosition: e.target.value })}
                  className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm"
                >
                   <option value="bottom">Bottom</option>
                   <option value="top">Top</option>
                </select>
             </div>
             
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                   <label className="text-sm font-medium">Show Desktop Icons</label>
                </div>
                <Switch 
                  checked={settings.showDesktopIcons || false}
                  onCheckedChange={(checked) => updateSettings.mutate({ showDesktopIcons: checked })}
                />
             </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <PaintBucket className="w-4 h-4" /> Theme
          </h3>
          
          <div className="bg-card rounded-lg border border-white/5 p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex gap-3">
                {THEME_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => updateSettings.mutate({ themeColor: color })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                      settings.themeColor === color ? "border-white scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                   <label className="text-sm font-medium">Dark Mode</label>
                </div>
                <Switch 
                  checked={settings.isDarkMode || false}
                  onCheckedChange={(checked) => updateSettings.mutate({ isDarkMode: checked })}
                />
             </div>
          </div>
        </section>

        {/* Animation Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4" /> Animations
          </h3>
          
          <div className="bg-card rounded-lg border border-white/5 p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Animation Speed</label>
              <select 
                value={settings.animationSpeed || "normal"}
                onChange={(e) => updateSettings.mutate({ animationSpeed: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="off">Off</option>
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Window Transitions</label>
              <select 
                value={settings.windowTransition || "spring"}
                onChange={(e) => updateSettings.mutate({ windowTransition: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="spring">Spring</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                   <label className="text-sm font-medium">Icon Animations</label>
                   <p className="text-xs text-muted-foreground">Animate desktop icons on hover</p>
                </div>
                <Switch 
                  checked={settings.iconAnimation ?? true}
                  onCheckedChange={(checked) => updateSettings.mutate({ iconAnimation: checked })}
                />
             </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4" /> Typography
          </h3>
          
          <div className="bg-card rounded-lg border border-white/5 p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Family</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_FAMILIES.map(font => (
                  <button
                    key={font.value}
                    onClick={() => updateSettings.mutate({ fontFamily: font.value })}
                    className={cn(
                      "py-2 px-3 rounded border transition-all text-sm",
                      settings.fontFamily === font.value 
                        ? "bg-primary/20 border-primary text-primary font-medium" 
                        : "bg-transparent border-white/10 hover:bg-white/5",
                      font.class
                    )}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
