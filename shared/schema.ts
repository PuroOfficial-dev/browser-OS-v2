import { pgTable, text, serial, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  wallpaperUrl: text("wallpaper_url").notNull().default("https://images.unsplash.com/photo-1472214103451-9374bd1c798e"),
  wallpaperType: text("wallpaper_type").notNull().default("image"), // 'image' | 'video'
  themeColor: text("theme_color").notNull().default("#87cf3e"), // Mint green
  cursorStyle: text("cursor_style").notNull().default("default"), // 'default', 'retro', 'crosshair', etc.
  isDarkMode: boolean("is_dark_mode").default(true),
  showDesktopIcons: boolean("show_desktop_icons").default(true),
  taskbarPosition: text("taskbar_position").default("bottom"), // 'bottom', 'top'
  animationSpeed: text("animation_speed").default("normal"), // 'slow', 'normal', 'fast', 'off'
  windowTransition: text("window_transition").default("spring"), // 'spring', 'fade', 'slide', 'none'
  iconAnimation: boolean("icon_animation").default(true),
  fontFamily: text("font_family").default("default"), // 'default', 'mono', 'serif', 'sans'
});

export const customApps = pgTable("custom_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("app-window"),
  content: text("content").notNull(), // HTML/Markdown or simple script
  config: jsonb("config").$type<{ color?: string }>().default({}),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export const insertCustomAppSchema = createInsertSchema(customApps);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type UpdateSettings = Partial<InsertSettings>;

export type CustomApp = typeof customApps.$inferSelect;
export type InsertCustomApp = z.infer<typeof insertCustomAppSchema>;

export const appShortcuts = [
  { id: "terminal", name: "Terminal", icon: "terminal", type: "app" },
  { id: "settings", name: "System Settings", icon: "settings", type: "app" },
  { id: "browser", name: "Web Browser", icon: "globe", type: "app" },
  { id: "files", name: "Files", icon: "folder", type: "app" },
  { id: "calculator", name: "Calculator", icon: "calculator", type: "app" },
  { id: "app-maker", name: "App Maker", icon: "plus-square", type: "app" },
] as const;
