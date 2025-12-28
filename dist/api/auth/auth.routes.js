"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
const upload_1 = require("../../middleware/upload");
const router = (0, express_1.Router)();
// Public routes
router.post("/signup", upload_1.uploadSingle, auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
// Protected routes (require authentication)
router.get("/me", auth_middleware_1.authenticate, auth_controller_1.getCurrentUser);
exports.default = router;
