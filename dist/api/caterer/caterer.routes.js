"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dishes_routes_1 = __importDefault(require("./dishes/dishes.routes"));
const packages_routes_1 = __importDefault(require("./packages/packages.routes"));
const router = (0, express_1.Router)();
// Mount dish routes at /dishes
router.use("/dishes", dishes_routes_1.default);
// Mount package routes at /packages
router.use("/packages", packages_routes_1.default);
exports.default = router;
