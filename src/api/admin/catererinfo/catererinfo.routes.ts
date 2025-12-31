import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import { uploadCatererDocuments } from "../../../middleware/upload";
import { getCatererInfoList, getCatererInfoByIdController, updateCatererInfoByIdController } from "./catererinfo.controller";

const router = Router();

// Get all caterer info with optional status filtering
// GET /api/admin/catererinfo?status=PENDING|APPROVED|REJECTED
// Requires authentication and ADMIN role
router.get("/", authenticate, requireRole("ADMIN"), getCatererInfoList);

// Get caterer info by ID
// GET /api/admin/catererinfo/:id
// Requires authentication and ADMIN role
router.get("/:id", authenticate, requireRole("ADMIN"), getCatererInfoByIdController);

// Update caterer info by ID
// PUT /api/admin/catererinfo/:id
// Requires authentication and ADMIN role
// Can update any field including status
router.put("/:id", authenticate, requireRole("ADMIN"), uploadCatererDocuments, updateCatererInfoByIdController);

export default router;

