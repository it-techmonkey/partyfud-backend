"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../auth/auth.middleware");
const packages_controller_1 = require("./packages.controller");
const package_items_controller_1 = require("../package-items/package-items.controller");
const upload_1 = require("../../../middleware/upload");
const router = (0, express_1.Router)();
// All routes require authentication and CATERER role
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.requireRole)("CATERER"));
// Package routes
router.get("/", packages_controller_1.getPackages);
router.post("/", upload_1.uploadSingle, packages_controller_1.createPackage);
// Link route must come before /:id to avoid route conflicts
router.post("/:id/items/link", package_items_controller_1.linkPackageItemsToPackage);
router.get("/:id", packages_controller_1.getPackageById);
router.put("/:id", upload_1.uploadSingle, packages_controller_1.updatePackage);
exports.default = router;
