/**
 * ENTRY MODEL
 *
 * What this file does:
 * - Defines the "Entry" schema stored in MongoDB
 * - Each entry belongs to a user (owner)
 * - Supports visibility (private/public) for public profile
 *
 * Why this matters:
 * - Forms the foundation for CRUD (create/read/update/delete)
 * - Enables "only my entries" logic + public profile view
 */

import mongoose, { Schema, models, model } from "mongoose";

export interface IEntry {
  ownerId: mongoose.Types.ObjectId;
  type: "AWS Lab" | "Project" | "DSA" | "Certificate";
  title: string;
  description: string;
  tags: string[];
  visibility: "private" | "public";
  date: string; // YYYY-MM-DD
}

const EntrySchema = new Schema<IEntry>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      required: true,
      enum: ["AWS Lab", "Project", "DSA", "Certificate"],
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    tags: { type: [String], default: [] },

    visibility: { type: String, enum: ["private", "public"], default: "private" },

    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Entry = models.Entry || model<IEntry>("Entry", EntrySchema);

export default Entry;
