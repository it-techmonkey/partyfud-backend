"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dishes_routes_1 = __importDefault(require("./dishes/dishes.routes"));
const packages_routes_1 = __importDefault(require("./packages/packages.routes"));
const package_items_routes_1 = __importDefault(require("./package-items/package-items.routes"));
const metadata_routes_1 = __importDefault(require("./metadata.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard/dashboard.routes"));
const router = (0, express_1.Router)();
// Mount dashboard routes at /dashboard
router.use("/dashboard", dashboard_routes_1.default);
// Mount dish routes at /dishes
router.use("/dishes", dishes_routes_1.default);
// Mount package items routes at /packages/items FIRST (before /packages to avoid route conflicts)
router.use("/packages/items", package_items_routes_1.default);
// Mount package routes at /packages (must come after /packages/items)
router.use("/packages", packages_routes_1.default);
// Mount metadata routes at /metadata
router.use("/metadata", metadata_routes_1.default);
exports.default = router;
