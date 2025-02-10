import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Pharmacist", "Cashier"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const User2 = mongoose.model("User2", userSchema);
export default User2;
