
import { Router } from "express";
import * as OrderController from "./orders.controller";

const router = Router();

router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);

export default router;
