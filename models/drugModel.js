import mongoose from "mongoose";

const drugSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    manufacturer: { type: String, required: true },
  },
  { timestamps: true }
);

const Drug = mongoose.model("Drug", drugSchema);
export default Drug;
