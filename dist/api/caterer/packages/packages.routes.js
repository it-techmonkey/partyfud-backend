"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../auth/auth.middleware");
const caterer_controller_1 = require("../caterer.controller");
const router = (0, express_1.Router)();
// All routes require authentication and CATERER role
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.requireRole)("CATERER"));
// Package routes
router.get("/", caterer_controller_1.getPackages);
router.get("/:id", caterer_controller_1.getPackageById);
router.post("/", caterer_controller_1.createPackage);
router.put("/:id", caterer_controller_1.updatePackage);
exports.default = router;
