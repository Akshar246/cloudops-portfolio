import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev
const User = models.User || model<IUser>("User", UserSchema);

export default User;



// What this does (quick mental model)

// Stores email + hashed password

// unique: true → no duplicate users

// timestamps → auto createdAt / updatedAt

// Safe for Next.js hot reload