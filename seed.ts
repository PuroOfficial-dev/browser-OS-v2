import Database from "better-sqlite3";
import { users } from "./shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const sqlite = new Database("database.db");

async function seed() {
  try {
    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        wallpaper_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
        wallpaper_type TEXT NOT NULL DEFAULT 'image',
        theme_color TEXT NOT NULL DEFAULT '#87cf3e',
        cursor_style TEXT NOT NULL DEFAULT 'default',
        is_dark_mode BOOLEAN DEFAULT 1,
        show_desktop_icons BOOLEAN DEFAULT 1,
        taskbar_position TEXT DEFAULT 'bottom',
        animation_speed TEXT DEFAULT 'normal',
        window_transition TEXT DEFAULT 'spring',
        icon_animation BOOLEAN DEFAULT 1,
        font_family TEXT DEFAULT 'default'
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS custom_apps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'app-window',
        content TEXT NOT NULL,
        config TEXT
      )
    `);

    // Check if default user exists
    const existingUser = sqlite.prepare("SELECT * FROM users WHERE username = ?").get("owner");

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("linuxosonyourbrowser1923&dontcomeaftermePLEASElunix", 10);

      sqlite.prepare(`
        INSERT INTO users (username, password, display_name, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run("owner", hashedPassword, "puro");

      console.log("Default user created:");
      console.log("Display Name: puro");
      console.log("Username: owner");
      console.log("Password: linuxosonyourbrowser1923&dontcomeaftermePLEASElunix");
    } else {
      console.log("Default user already exists");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    sqlite.close();
  }
}

seed();