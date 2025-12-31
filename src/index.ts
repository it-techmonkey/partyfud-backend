import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./api/routes";

const app = express();

// CORS configuration with environment-based defaults
const getCorsOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  }
  
  // Development defaults
  if (process.env.NODE_ENV !== 'production') {
    return ['https://partyfud-frontend.vercel.app/', 'http://localhost:3000'];
  }
  
  // Production: require explicit configuration
  return [];
};

const allowedOrigins = getCorsOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.length === 0) {
      console.warn('⚠️  No CORS origins configured! All requests will be blocked.');
      return callback(new Error('CORS not configured'));
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
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

