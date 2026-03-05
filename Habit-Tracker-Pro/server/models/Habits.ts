import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    color: { type: String, default: "#8b5cf6" },
    icon: { type: String, default: "target" },
    category: { type: String, default: "general" },
    target: { type: Number, default: 1 },
    archived: { type: Boolean, default: false },
    logs: [String],
  },
  { timestamps: true }
);

export const Habit = mongoose.model("Habit", habitSchema);