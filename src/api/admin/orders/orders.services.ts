
import prisma from "../../../lib/prisma";

import { Prisma } from "@prisma/client";

export const getAllOrders = async (filters: { status?: string; startDate?: Date; endDate?: Date; search?: string; catererId?: string }) => {
    const where: any = {};

    if (filters.status && filters.status !== 'ALL') {
        where.status = filters.status as any;
    }

    if (filters.catererId && filters.catererId !== 'ALL') {
        where.items = {
            some: {
                package: {
                    caterer_id: filters.catererId
                }
            }
        };
    }

    if (filters.startDate || filters.endDate) {
        where.created_at = {};
        if (filters.startDate) {
            where.created_at.gte = filters.startDate;
        }
        if (filters.endDate) {
            // Set end date to end of day
            const endOfDay = new Date(filters.endDate);
            endOfDay.setHours(23, 59, 59, 999);
            where.created_at.lte = endOfDay;
        }
    }

    if (filters.search) {
        where.OR = [
            { id: { contains: filters.search, mode: 'insensitive' } },
            {
                user: {
                    OR: [
                        { first_name: { contains: filters.search, mode: 'insensitive' } },
                        { last_name: { contains: filters.search, mode: 'insensitive' } },
                        { email: { contains: filters.search, mode: 'insensitive' } },
                    ]
                }
            }
        ];
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: {
            created_at: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    phone: true,
                },
            },
            items: {
                include: {
                    package: {
                        select: {
                            name: true,
                            caterer: {
                                select: {
                                    company_name: true,
                                    first_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    return orders;
};

export const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    phone: true,
                    company_name: true,
                },
            },
            items: {
                include: {
                    package: {
                        include: {
                            caterer: {
                                include: {
                                    catererinfo: true,
                                },
                            },
                        },
                    },
                    add_ons: {
                        include: {
                            add_on: true,
                        },
                    },
                },
            },
        },
    });
    return order;
};
