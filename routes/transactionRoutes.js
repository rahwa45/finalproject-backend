import express from "express";
import {
  processPayment,
  getTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", processPayment);
router.get("/", getTransactions);

export default router;
