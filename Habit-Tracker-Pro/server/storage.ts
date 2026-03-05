import { Habit } from "./models/Habits";
import { Todo } from "./models/Todo";

export const storage = {

  // =====================
  // HABITS
  // =====================

  async getHabits(userId: string) {
    return Habit.find({ userId }).sort({ createdAt: -1 });
  },

  async createHabit(userId: string, input: any) {
    return Habit.create({ ...input, userId });
  },

  async updateHabit(id: string, input: any) {
    return Habit.findByIdAndUpdate(id, input, { new: true });
  },

  async deleteHabit(id: string) {
    return Habit.findByIdAndDelete(id);
  },

  async logHabit(habitId: string, date: string) {
    return Habit.findByIdAndUpdate(
      habitId,
      { $addToSet: { logs: date } },
      { new: true }
    );
  },

  async unlogHabit(habitId: string, date: string) {
    return Habit.findByIdAndUpdate(
      habitId,
      { $pull: { logs: date } },
      { new: true }
    );
  },

  // =====================
  // STREAK CALCULATION
  // =====================

  calculateStreak(dates: string[]) {
    if (!dates || dates.length === 0) return 0;

    const sorted = [...new Set(dates)]
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const date of sorted) {
      const logDate = new Date(date);
      logDate.setHours(0, 0, 0, 0);

      const diff = Math.round(
        (today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  calculateBestStreak(dates: string[]) {
    if (!dates || dates.length === 0) return 0;

    const sorted = [...new Set(dates)]
      .map(d => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.round(
        (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return bestStreak;
  },

  // =====================
  // DASHBOARD / STATS
  // =====================

  async getStats(userId: string) {
    const habits = await this.getHabits(userId);
    const todos = await this.getTodos(userId);

    const today = new Date().toISOString().split("T")[0];

    let completedToday = 0;
    let totalLogs = 0;
    const allDates: string[] = [];
    const habitStreaks: number[] = [];

    habits.forEach((habit: any) => {
      const logs = habit.logs || [];
      if (logs.includes(today)) completedToday++;
      totalLogs += logs.length;
      allDates.push(...logs);
      habitStreaks.push(this.calculateStreak(logs));
    });

    const totalHabits = habits.length;
    const currentStreak = Math.max(0, ...habitStreaks, 0);
    const bestStreak = this.calculateBestStreak(allDates);

    const completionRate =
      totalHabits === 0
        ? 0
        : Math.round((completedToday / totalHabits) * 100);

    // Generate weekly data (last 7 days)
    const weeklyData: { date: string; completed: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      let dayCompleted = 0;
      habits.forEach((habit: any) => {
        if ((habit.logs || []).includes(dateStr)) dayCompleted++;
      });

      weeklyData.push({
        date: dayName,
        completed: dayCompleted,
        total: totalHabits,
      });
    }

    // Monthly data (last 30 days)
    const monthlyData: { date: string; completed: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      let dayCompleted = 0;
      habits.forEach((habit: any) => {
        if ((habit.logs || []).includes(dateStr)) dayCompleted++;
      });
      monthlyData.push({ date: dateStr, completed: dayCompleted });
    }

    // Todo stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter((t: any) => t.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    // Category breakdown
    const categories: Record<string, number> = {};
    habits.forEach((habit: any) => {
      const cat = habit.category || "general";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return {
      totalHabits,
      completedToday,
      completionRate,
      currentStreak,
      bestStreak,
      totalLogs,
      weeklyData,
      monthlyData,
      totalTodos,
      completedTodos,
      pendingTodos,
      categories,
      habits: habits.map((h: any) => ({
        ...h.toObject(),
        streak: this.calculateStreak(h.logs || []),
        completionRate: h.logs
          ? Math.round((h.logs.length / Math.max(1, 30)) * 100)
          : 0,
      })),
    };
  },

  // =====================
  // ANALYTICS
  // =====================

  async getAnalytics(userId: string) {
    const stats = await this.getStats(userId);

    const suggestions: string[] = [];
    const insights: string[] = [];

    if (stats.completionRate < 30) {
      insights.push("Your completion rate is below 30%. Focus on building small consistent habits first.");
      suggestions.push("Start with just 2-3 habits and build from there.");
      suggestions.push("Set specific times for each habit to create routine anchors.");
    } else if (stats.completionRate < 60) {
      insights.push("You're making progress! Your completion rate shows room for growth.");
      suggestions.push("Try habit stacking - attach new habits to existing routines.");
      suggestions.push("Use the 2-minute rule: start with a habit that takes less than 2 minutes.");
    } else if (stats.completionRate < 85) {
      insights.push("Great consistency! You're building strong habits.");
      suggestions.push("Consider increasing the challenge level of your easiest habits.");
      suggestions.push("Try adding one new habit this week to push your growth.");
    } else {
      insights.push("Exceptional performance! You're in the top tier of habit builders.");
      suggestions.push("You're ready to tackle more complex or challenging habits.");
      suggestions.push("Consider mentoring others or sharing your routine strategies.");
    }

    if (stats.currentStreak === 0) {
      suggestions.push("Start today! Every streak begins with day one.");
    } else if (stats.currentStreak < 7) {
      suggestions.push(`You're on a ${stats.currentStreak}-day streak. Push for 7 days!`);
    } else if (stats.currentStreak < 30) {
      suggestions.push(`Amazing ${stats.currentStreak}-day streak! Go for 30 days.`);
    } else {
      suggestions.push(`Incredible ${stats.currentStreak}-day streak! You've built an unstoppable routine.`);
    }

    if (stats.pendingTodos > 5) {
      suggestions.push("You have several pending tasks. Consider prioritizing or removing stale ones.");
    }

    // Productivity score (0–100)
    const productivityScore = Math.min(100, Math.round(
      (stats.completionRate * 0.4) +
      (Math.min(stats.currentStreak, 30) / 30 * 30) +
      (stats.completedTodos / Math.max(1, stats.totalTodos) * 30)
    ));

    return {
      ...stats,
      insights,
      suggestions,
      productivityScore,
    };
  },

  // =====================
  // TODOS
  // =====================

  async getTodos(userId: string) {
    return Todo.find({ userId }).sort({ createdAt: -1 });
  },

  async createTodo(userId: string, input: any) {
    return Todo.create({ ...input, userId });
  },

  async updateTodo(id: string, input: any) {
    return Todo.findByIdAndUpdate(id, input, { new: true });
  },

  async deleteTodo(id: string) {
    return Todo.findByIdAndDelete(id);
  },
};