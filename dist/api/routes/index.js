"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../auth/auth.routes"));
const user_routes_1 = __importDefault(require("../user/user.routes"));
const admin_routes_1 = __importDefault(require("../admin/admin.routes"));
const caterer_routes_1 = __importDefault(require("../caterer/caterer.routes"));
const router = (0, express_1.Router)();
// Health check route
router.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});
// Auth routes (authentication for all user types)
router.use("/auth", auth_routes_1.default);
// User routes
router.use("/user", user_routes_1.default);
// Admin routes
router.use("/admin", admin_routes_1.default);
// Caterer routes
router.use("/caterer", caterer_routes_1.default);
exports.default = router;
