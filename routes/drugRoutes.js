import express from "express";
import { verifyToken } from "../authMiddleware.js";
import {
  getDrugs,
  getDrugById,
  addDrugs,
  updateDrug,
  deleteDrug,
} from "../controllers/drugController.js";

const router = express.Router();

router.get("/", verifyToken, getDrugs);
router.get("/:id", verifyToken, getDrugById);
router.post("/", verifyToken, addDrugs);
router.put("/:id", verifyToken, updateDrug);
router.delete("/:id", verifyToken, deleteDrug);

export default router;
