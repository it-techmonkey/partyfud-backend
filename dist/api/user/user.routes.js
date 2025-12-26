"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Placeholder route - to be expanded
router.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "User routes - coming soon",
    });
});
exports.default = router;
