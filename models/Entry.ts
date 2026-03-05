/**
 * ENTRY MODEL
 */

import mongoose, { Schema, models, model } from "mongoose";

export interface IProof {
  key: string; // S3 object key
  contentType: string; // image/png, application/pdf
  size: number; // bytes
  originalName: string; // original filename
  uploadedAt: Date;
}

export interface IEntry {
  ownerId: mongoose.Types.ObjectId;
  type: "AWS Lab" | "Project" | "DSA" | "Certificate";
  title: string;
  description: string;
  problem: string;
  approach: string;
  outcome: string;
  securityDecisions: string;
  whatILearned: string;
  tags: string[];
  visibility: "private" | "public";
  date: string; // YYYY-MM-DD
  proofs: IProof[];
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
    problem: { type: String, default: "", trim: true },
    approach: { type: String, default: "", trim: true },
    outcome: { type: String, default: "", trim: true },
    securityDecisions: { type: String, default: "", trim: true },
    whatILearned: { type: String, default: "", trim: true },

    tags: { type: [String], default: [] },

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    date: { type: String, required: true },

    // Proof files stored in S3
    proofs: [
      {
        key: { type: String, required: true },
        contentType: { type: String, required: true },
        size: { type: Number, required: true },
        originalName: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Entry = models.Entry || model<IEntry>("Entry", EntrySchema);

export default Entry;
