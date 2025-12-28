"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../auth/auth.middleware");
const package_items_controller_1 = require("./package-items.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.requireRole)("CATERER"));
// Package Items routes
router.post("/", package_items_controller_1.createPackageItem);
router.get("/", package_items_controller_1.getPackageItems);
router.get("/:id", package_items_controller_1.getPackageItemById);
router.put("/:id", package_items_controller_1.updatePackageItem);
router.delete("/:id", package_items_controller_1.deletePackageItem);
// Note: Link route is handled in packages.routes.ts as POST /packages/:id/items/link
exports.default = router;
