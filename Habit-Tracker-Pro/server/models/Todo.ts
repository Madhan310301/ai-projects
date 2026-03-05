import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    tags: [String],
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);