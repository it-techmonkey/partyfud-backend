"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../auth/auth.middleware");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
// Get dashboard statistics
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)("CATERER"), dashboard_controller_1.getDashboard);
exports.default = router;
