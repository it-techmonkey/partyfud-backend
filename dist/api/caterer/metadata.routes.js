"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const metadata_controller_1 = require("./metadata.controller");
const router = (0, express_1.Router)();
// All routes require authentication and CATERER role
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.requireRole)("CATERER"));
// Metadata routes
router.get("/cuisine-types", metadata_controller_1.getCuisineTypes);
router.get("/categories", metadata_controller_1.getCategories);
router.get("/subcategories", metadata_controller_1.getSubCategories);
router.get("/freeforms", metadata_controller_1.getFreeForms);
router.get("/package-types", metadata_controller_1.getPackageTypes);
exports.default = router;
