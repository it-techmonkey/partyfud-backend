import { Router, Request, Response } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import { uploadCatererDocuments } from "../../../middleware/upload";
import {
  getCatererInfoList,
  getCatererInfoByIdController,
  updateCatererInfoByIdController,
  getCatererFinancialsController,
} from "./catererinfo.controller";

const router = Router({ mergeParams: true });

// Debug: Log when routes file is loaded
console.log("✅ [Routes] CatererInfo routes initialized");

// CRITICAL: Define specific routes BEFORE generic parameter routes
// Route order matters in Express - more specific routes must come first

// Get all caterer info with optional status filtering
// GET /api/admin/catererinfo?status=PENDING|APPROVED|REJECTED
router.get("/", authenticate, requireRole("ADMIN"), getCatererInfoList);

// Get caterer financials - using query parameter like orders route
// GET /api/admin/catererinfo/financials?catererId=xxx
router.get("/financials", 
  (req: Request, res: Response, next) => {
    console.log('🔵 [FINANCIALS ROUTE] Route matched!');
    console.log('🔵 [FINANCIALS ROUTE] Method:', req.method);
    console.log('🔵 [FINANCIALS ROUTE] Path:', req.path);
    console.log('🔵 [FINANCIALS ROUTE] URL:', req.url);
    console.log('🔵 [FINANCIALS ROUTE] Query:', req.query);
    next();
  },
  authenticate, 
  requireRole("ADMIN"), 
  getCatererFinancialsController
);

// Get caterer info by ID
// GET /api/admin/catererinfo/:id
router.get(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  getCatererInfoByIdController
);

// Update caterer info by ID
// PUT /api/admin/catererinfo/:id
router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  uploadCatererDocuments,
  updateCatererInfoByIdController
);

export default router;
