import express from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser);

export default router;
