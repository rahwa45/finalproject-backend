import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import drugRoutes from "./routes/drugRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();

//Middleware

app.use(cors());
let corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(express.json());

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/drugs", drugRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

//Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
