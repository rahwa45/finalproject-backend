import express from "express";
import { verifyToken } from "../authMiddleware.js";
import {
  addPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
  deletePrescription,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/", verifyToken, addPrescription);
router.get("/", verifyToken, getPrescriptions);
router.get("/:id", verifyToken, getPrescriptionById);
router.put("/:id", verifyToken, updatePrescriptionStatus);
router.delete("/:id", verifyToken, deletePrescription);

export default router;
