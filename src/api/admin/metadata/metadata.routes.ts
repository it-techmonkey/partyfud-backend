import { Router } from "express";
import { authenticate, requireRole } from "../../auth/auth.middleware";
import * as metadataController from "./metadata.controller";

const router = Router();

// All metadata routes require authentication and ADMIN role
const adminOnly = [authenticate, requireRole("ADMIN")];

// Cuisine Types
router.get("/cuisine-types", ...adminOnly, metadataController.getCuisineTypes);
router.post("/cuisine-types", ...adminOnly, metadataController.createCuisineType);
router.put("/cuisine-types/:id", ...adminOnly, metadataController.updateCuisineType);
router.delete("/cuisine-types/:id", ...adminOnly, metadataController.deleteCuisineType);

// Categories
router.get("/categories", ...adminOnly, metadataController.getCategories);
router.post("/categories", ...adminOnly, metadataController.createCategory);
router.put("/categories/:id", ...adminOnly, metadataController.updateCategory);
router.delete("/categories/:id", ...adminOnly, metadataController.deleteCategory);

// Sub Categories
router.get("/subcategories", ...adminOnly, metadataController.getSubCategories);
router.post("/subcategories", ...adminOnly, metadataController.createSubCategory);
router.put("/subcategories/:id", ...adminOnly, metadataController.updateSubCategory);
router.delete("/subcategories/:id", ...adminOnly, metadataController.deleteSubCategory);

// Certifications
router.get("/certifications", ...adminOnly, metadataController.getCertifications);
router.post("/certifications", ...adminOnly, metadataController.createCertification);
router.put("/certifications/:id", ...adminOnly, metadataController.updateCertification);
router.delete("/certifications/:id", ...adminOnly, metadataController.deleteCertification);

// Occasions
router.get("/occasions", ...adminOnly, metadataController.getOccasions);
router.post("/occasions", ...adminOnly, metadataController.createOccasion);
router.put("/occasions/:id", ...adminOnly, metadataController.updateOccasion);
router.delete("/occasions/:id", ...adminOnly, metadataController.deleteOccasion);

// Free Forms
router.get("/freeforms", ...adminOnly, metadataController.getFreeForms);
router.post("/freeforms", ...adminOnly, metadataController.createFreeForm);
router.put("/freeforms/:id", ...adminOnly, metadataController.updateFreeForm);
router.delete("/freeforms/:id", ...adminOnly, metadataController.deleteFreeForm);

export default router;
