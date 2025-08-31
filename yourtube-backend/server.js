// yourtube-backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
// ✅ NEW
import downloadRoutes from "./routes/downloadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// (your existing comment sanitiser middleware here if you wish)

app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
// ✅ NEW
app.use("/api/downloads", downloadRoutes);
app.use("/api/payments", paymentRoutes);

// Default handler for unknown routes → always return JSON, not HTML
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
