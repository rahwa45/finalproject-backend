import express from "express";
import { verifyToken } from "../authMiddleware.js";
import { getDrugs } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", verifyToken, getDrugs);

export default router;
