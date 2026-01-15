import { settings, type Settings, type InsertSettings, type UpdateSettings, customApps, type CustomApp, type InsertCustomApp, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<void>;

  // Settings methods
  getSettings(userId?: number): Promise<Settings>;
  updateSettings(settings: UpdateSettings, userId?: number): Promise<Settings>;

  // Apps methods
  getApps(): Promise<CustomApp[]>;
  createApp(app: InsertCustomApp): Promise<CustomApp>;
  deleteApp(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }

  // Settings methods
  async getSettings(userId?: number): Promise<Settings> {
    let query = db.select().from(settings);
    if (userId) {
      query = query.where(eq(settings.userId, userId));
    }
    const [existing] = await query;
    if (existing) return existing;

    // Create default settings if none exist
    const defaultSettings = userId ? { userId } : {};
    const [created] = await db.insert(settings).values(defaultSettings).returning();
    return created;
  }

  async updateSettings(updates: UpdateSettings, userId?: number): Promise<Settings> {
    const current = await this.getSettings(userId);
    const [updated] = await db
      .update(settings)
      .set(updates)
      .where(eq(settings.id, current.id))
      .returning();
    return updated;
  }

  async getApps(): Promise<CustomApp[]> {
    return await db.select().from(customApps);
  }

  async createApp(app: InsertCustomApp): Promise<CustomApp> {
    const [created] = await db.insert(customApps).values(app).returning();
    return created;
  }

  async deleteApp(id: number): Promise<void> {
    await db.delete(customApps).where(eq(customApps.id, id));
  }
}

export const storage = new DatabaseStorage();
