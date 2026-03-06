import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import admin from "./firebase";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

function getParam(param: string | string[] | undefined): string {
  if (!param) return "";
  return Array.isArray(param) ? param[0] : param;
}

async function authenticate(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/api", apiLimiter);

  // =====================
  // AUTH
  // =====================

  app.post("/api/auth/firebase", async (req, res) => {
    const { token } = req.body;
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      res.json({ uid: decoded.uid });
    } catch {
      res.status(401).json({ message: "Invalid Firebase token" });
    }
  });

  // =====================
  // HABITS
  // =====================

  app.get("/api/habits", authenticate, async (req: any, res) => {
    const habits = await storage.getHabits(req.userId);
    const enriched = habits.map((h: any) => ({
      ...h.toObject(),
      streak: storage.calculateStreak(h.logs || []),
      completionRate: h.logs
        ? Math.round((h.logs.length / Math.max(1, 30)) * 100)
        : 0,
    }));
    res.json(enriched);
  });

  app.post("/api/habits", authenticate, async (req: any, res) => {
    try {
      const habit = await storage.createHabit(req.userId, req.body);
      res.status(201).json(habit);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Validation error" });
    }
  });

  app.patch("/api/habits/:id", authenticate, async (req: any, res) => {
    const id = getParam(req.params.id);
    const habit = await storage.updateHabit(id, req.body);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json(habit);
  });

  app.delete("/api/habits/:id", authenticate, async (req: any, res) => {
    const id = getParam(req.params.id);
    await storage.deleteHabit(id);
    res.status(204).send();
  });

  // =====================
  // HABIT LOGS
  // =====================

  app.post("/api/habits/:id/log", authenticate, async (req: any, res) => {
    const id = getParam(req.params.id);
    const date = typeof req.body.date === "string" ? req.body.date : String(req.body.date);
    const log = await storage.logHabit(id, date);
    res.status(201).json(log);
  });

  app.delete("/api/habits/:id/log/:date", authenticate, async (req: any, res) => {
    const id = getParam(req.params.id);
    const date = getParam(req.params.date);
    await storage.unlogHabit(id, date);
    res.status(204).send();
  });

  // =====================
  // DASHBOARD
  // =====================

  app.get("/api/dashboard", authenticate, async (req: any, res) => {
    const stats = await storage.getStats(req.userId);
    res.json(stats);
  });

  // =====================
  // ANALYTICS
  // =====================

  app.get("/api/analytics", authenticate, async (req: any, res) => {
    const analytics = await storage.getAnalytics(req.userId);
    res.json(analytics);
  });

  // =====================
  // TODOS
  // =====================

  app.get("/api/todos", authenticate, async (req: any, res) => {
    const todos = await storage.getTodos(req.userId);
    res.json(todos);
  });

  app.post("/api/todos", authenticate, async (req: any, res) => {
    try {
      const todo = await storage.createTodo(req.userId, req.body);
      res.status(201).json(todo);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Validation error" });
    }
  });

  app.patch("/api/todos/:id", authenticate, async (req: any, res) => {
    const id = getParam(req.params.id);
    const todo = await storage.updateTodo(id, req.body);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  });

  app.delete("/api/todos/:id", authenticate, async (req: any, res) => {
    const id = getParam(req.params.id);
    await storage.deleteTodo(id);
    res.status(204).send();
  });

  return httpServer;
}