import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

// API routes with prefixes: /api/user, /api/admin, /api/caterer
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

