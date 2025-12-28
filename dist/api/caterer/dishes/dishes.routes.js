"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../auth/auth.middleware");
const dishes_controller_1 = require("./dishes.controller");
const upload_1 = require("../../../middleware/upload");
const router = (0, express_1.Router)();
// All routes require authentication and CATERER role
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.requireRole)("CATERER"));
// Dish routes
router.get("/", dishes_controller_1.getDishes);
router.get("/:id", dishes_controller_1.getDishById);
router.post("/", upload_1.uploadSingle, dishes_controller_1.createDish);
router.put("/:id", upload_1.uploadSingle, dishes_controller_1.updateDish);
router.delete("/:id", dishes_controller_1.deleteDish);
exports.default = router;
