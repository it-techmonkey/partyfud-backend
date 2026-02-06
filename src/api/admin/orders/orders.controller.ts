
import { Request, Response } from "express";
import * as OrderService from "./orders.services";

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status, startDate, endDate, search, catererId } = req.query;

        const filters = {
            status: status as string,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            search: search as string,
            catererId: catererId as string,
        };

        const orders = await OrderService.getAllOrders(filters);
        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await OrderService.getOrderById(id);

        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
