import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    drugDetails: [
      {
        drugId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Drug",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Paid", "Dispensed"],
      default: "Pending",
    },
    totalCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
