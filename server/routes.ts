import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import express from "express";
import fs from "fs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import type { User } from "@shared/schema";

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Passport configuration
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth routes
  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate("local", async (err: any, user: User | false, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      req.logIn(user, async (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }

        await storage.updateUserLastLogin(user.id);
        res.json({ user, message: "Login successful" });
      });
    })(req, res, next);
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
      });

      // Create default settings for the user
      await storage.getSettings(user.id);

      res.status(201).json({ user, message: "Registration successful" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors });
        return;
      }
      throw err;
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.get(api.settings.get.path, async (req, res) => {
    const userId = req.user?.id;
    const settings = await storage.getSettings(userId);
    res.json(settings);
  });

  app.patch(api.settings.update.path, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const userId = req.user?.id;
      const updated = await storage.updateSettings(input, userId);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors });
        return;
      }
      throw err;
    }
  });

  app.get(api.apps.list.path, async (req, res) => {
    const apps = await storage.getApps();
    res.json(apps);
  });

  app.post(api.apps.create.path, async (req, res) => {
    try {
      const input = api.apps.create.input.parse(req.body);
      const app = await storage.createApp(input);
      res.status(201).json(app);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors });
        return;
      }
      throw err;
    }
  });

  app.post("/api/upload", multerUpload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  return httpServer;
}
