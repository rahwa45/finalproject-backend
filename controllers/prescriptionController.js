import Prescription from "../models/prescriptionModel.js";
import Drug from "../models/drugModel.js";

// Add a new prescription
export const addPrescription = async (req, res) => {
  const { patientName, drugDetails } = req.body;

  try {
    for (const drugDetail of drugDetails) {
      const drug = await Drug.findById(drugDetail.drugId);
      if (!drug) {
        return res
          .status(404)
          .json({ message: `Drug with ID ${drugDetail.drugId} not found` });
      }
      if (drug.quantity < drugDetail.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for drug: ${drug.name}. Available: ${drug.quantity}`,
        });
      }

      // Subtract the prescribed quantity from stock
      drug.quantity -= drugDetail.quantity;
      await drug.save(); // Save the updated drug
    }
    const prescription = await Prescription.create({
      patientName,
      drugDetails,
      status,
    });
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Error creating prescription" });
  }
};

// Get all prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate(
      "drugDetails.drugId"
    );
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
};

// Get a single prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate(
      "drugDetails.drugId"
    );
    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescription" });
  }
};

// Update prescription status
export const updatePrescriptionStatus = async (req, res) => {
  const { status } = req.body;

  // Ensure that status is one of the allowed values
  if (!["Pending", "Paid", "Dispensed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check if the status change is allowed based on the current status
    if (prescription.status === "Pending" && status !== "Paid") {
      return res
        .status(400)
        .json({ message: "Only 'Paid' status is allowed from 'Pending'" });
    }
    if (prescription.status === "Paid" && status !== "Dispensed") {
      return res
        .status(400)
        .json({ message: "Only 'Dispensed' status is allowed from 'Paid'" });
    }

    // Update the prescription status
    prescription.status = status;
    const updatedPrescription = await prescription.save();

    res.status(200).json(updatedPrescription);
  } catch (error) {
    res.status(500).json({ message: "Error updating prescription status" });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const deletePrescription = await Prescription.findByIdAndDelete(
      req.params.id
    );
    if (!deletePrescription) {
      return res.status(400).json({ message: "Prescription not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting prescription status" });
  }
};
