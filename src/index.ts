import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes";

const app = express();

// CORS configuration - open to all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

// Debug: Log all incoming requests to /api/admin BEFORE routes
app.use("/api/admin", (req, res, next) => {
  console.log('🔵 [INCOMING REQUEST]', req.method, req.path);
  console.log('🔵 [INCOMING REQUEST] Query:', req.query);
  console.log('🔵 [INCOMING REQUEST] Params:', req.params);
  next();
});

// API routes with prefixes: /api/user, /api/admin, /api/caterer
app.use("/api", apiRoutes);

// Global error handler for unhandled errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

