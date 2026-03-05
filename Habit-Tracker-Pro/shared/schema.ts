import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import Auth Tables
export * from "./models/auth";
// Import Chat Tables
export * from "./models/chat";

import { users } from "./models/auth";

// === TABLE DEFINITIONS ===

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id (which is text/uuid)
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").default("daily"), // daily, weekly
  color: text("color").default("#3b82f6"), // Hex color for UI
  reminderTime: text("reminder_time"), // HH:MM format
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull().references(() => habits.id),
  completedAt: timestamp("completed_at").defaultNow(),
  date: date("date").notNull(), // YYYY-MM-DD string
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id
  task: text("task").notNull(),
  completed: boolean("completed").default(false),
  type: text("type").default("daily"), // daily, weekly, monthly
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const habitsRelations = relations(habits, ({ many }) => ({
  logs: many(habitLogs),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, {
    fields: [habitLogs.habitId],
    references: [habits.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertHabitSchema = createInsertSchema(habits).omit({ 
  id: true, 
  userId: true, 
  createdAt: true 
});

export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({ 
  id: true, 
  completedAt: true 
});

export const insertTodoSchema = createInsertSchema(todos).omit({ 
  id: true, 
  userId: true, 
  createdAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;

// Request types
export type CreateHabitRequest = InsertHabit;
export type UpdateHabitRequest = Partial<InsertHabit>;

export type CreateTodoRequest = InsertTodo;
export type UpdateTodoRequest = Partial<InsertTodo>;

// Complex Response Types (for Stats/Dashboard)
export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
  streak: number;
  completionRate: number; // Percentage
}

export interface DashboardStats {
  totalHabits: number;
  completedToday: number;
  overallCompletionRate: number;
  currentStreak: number;
}
