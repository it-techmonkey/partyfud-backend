import prisma from "../../../lib/prisma";

/**
 * Create an order from cart items
 */
export interface CreateOrderInput {
  cart_item_ids?: string[]; // Optional: create order from specific cart items
  items: Array<{
    package_id: string;
    location?: string;
    guests?: number;
    date?: Date;
    price_at_time: number;
  }>;
}

export const createOrder = async (userId: string, input: CreateOrderInput) => {
  // If cart_item_ids provided, fetch items from cart
  let orderItems = input.items;

  if (input.cart_item_ids && input.cart_item_ids.length > 0) {
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        items: {
          where: {
            id: { in: input.cart_item_ids },
          },
          include: {
            package: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart items not found");
    }

    // Convert cart items to order items format
    orderItems = cart.items.map((item) => ({
      package_id: item.package_id,
      location: item.location || undefined,
      guests: item.guests || undefined,
      date: item.date || undefined,
      price_at_time: item.price_at_time
        ? Number(item.price_at_time)
        : Number(item.package.total_price),
    }));
  }

  // Validate all packages exist and are available
  const packageIds = orderItems.map((item) => item.package_id);
  const packages = await prisma.package.findMany({
    where: {
      id: { in: packageIds },
      is_active: true,
      is_available: true,
    },
  });

  if (packages.length !== packageIds.length) {
    throw new Error("One or more packages not found or not available");
  }

  // Calculate total price
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price_at_time,
    0
  );

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        user_id: userId,
        total_price: totalPrice,
        currency: "AED",
        status: "PENDING",
        items: {
          create: orderItems.map((item) => ({
            package_id: item.package_id,
            location: item.location,
            guests: item.guests,
            date: item.date,
            price_at_time: item.price_at_time,
          })),
        },
      },
      include: {
        items: {
          include: {
            package: {
              include: {
                package_type: true,
                caterer: {
                  include: {
                    catererinfo: true,
                  },
                },
              },
            },
            package_type: true,
          },
        },
      },
    });

    // If order was created from cart items, remove them from cart
    if (input.cart_item_ids && input.cart_item_ids.length > 0) {
      await tx.cartItem.deleteMany({
        where: {
          id: { in: input.cart_item_ids },
          cart: {
            user_id: userId,
          },
        },
      });
    }

    return newOrder;
  });

  return {
    id: order.id,
    user_id: order.user_id,
    total_price: Number(order.total_price),
    currency: order.currency,
    status: order.status,
    items: order.items.map((item) => ({
      id: item.id,
      package: {
        id: item.package.id,
        name: item.package.name,
        people_count: item.package.people_count,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        package_type: {
          id: item.package.package_type.id,
          name: item.package.package_type.name,
        },
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      package_type: {
        id: item.package_type.id,
        name: item.package_type.name,
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      created_at: item.created_at,
    })),
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
};

/**
 * Update an order (mainly status and items)
 */
export interface UpdateOrderInput {
  status?: "PENDING" | "CONFIRMED" | "PAID" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  total_price?: number;
}

export const updateOrder = async (
  userId: string,
  orderId: string,
  input: UpdateOrderInput
) => {
  // Verify order belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      user_id: userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Don't allow status changes if order is already delivered or cancelled
  if (
    order.status === "DELIVERED" ||
    order.status === "CANCELLED"
  ) {
    throw new Error(
      `Cannot update order with status ${order.status}`
    );
  }

  // Update order
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: input.status || order.status,
      total_price: input.total_price
        ? input.total_price
        : order.total_price,
    },
    include: {
      items: {
        include: {
          package: {
            include: {
              package_type: true,
              caterer: {
                include: {
                  catererinfo: true,
                },
              },
            },
          },
          package_type: true,
        },
      },
    },
  });

  return {
    id: updatedOrder.id,
    user_id: updatedOrder.user_id,
    total_price: Number(updatedOrder.total_price),
    currency: updatedOrder.currency,
    status: updatedOrder.status,
    items: updatedOrder.items.map((item) => ({
      id: item.id,
      package: {
        id: item.package.id,
        name: item.package.name,
        people_count: item.package.people_count,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        package_type: {
          id: item.package.package_type.id,
          name: item.package.package_type.name,
        },
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      package_type: {
        id: item.package_type.id,
        name: item.package_type.name,
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      created_at: item.created_at,
    })),
    created_at: updatedOrder.created_at,
    updated_at: updatedOrder.updated_at,
  };
};

/**
 * Delete an order (only if status is PENDING or CANCELLED)
 */
export const deleteOrder = async (userId: string, orderId: string) => {
  // Verify order belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      user_id: userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Only allow deletion if order is PENDING or CANCELLED
  if (order.status !== "PENDING" && order.status !== "CANCELLED") {
    throw new Error(
      `Cannot delete order with status ${order.status}. Only PENDING or CANCELLED orders can be deleted.`
    );
  }

  // Delete order (cascade will delete order items)
  await prisma.order.delete({
    where: { id: orderId },
  });

  return { success: true, message: "Order deleted successfully" };
};

/**
 * Get all orders for a user
 */
export const getOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    include: {
      items: {
        include: {
          package: {
            include: {
              package_type: true,
              caterer: {
                include: {
                  catererinfo: true,
                },
              },
            },
          },
          package_type: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    user_id: order.user_id,
    total_price: Number(order.total_price),
    currency: order.currency,
    status: order.status,
    items: order.items.map((item) => ({
      id: item.id,
      package: {
        id: item.package.id,
        name: item.package.name,
        people_count: item.package.people_count,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        package_type: {
          id: item.package.package_type.id,
          name: item.package.package_type.name,
        },
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      package_type: {
        id: item.package_type.id,
        name: item.package_type.name,
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      created_at: item.created_at,
    })),
    created_at: order.created_at,
    updated_at: order.updated_at,
  }));
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      user_id: userId,
    },
    include: {
      items: {
        include: {
          package: {
            include: {
              package_type: true,
              caterer: {
                include: {
                  catererinfo: true,
                },
              },
            },
          },
          package_type: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return {
    id: order.id,
    user_id: order.user_id,
    total_price: Number(order.total_price),
    currency: order.currency,
    status: order.status,
    items: order.items.map((item) => ({
      id: item.id,
      package: {
        id: item.package.id,
        name: item.package.name,
        people_count: item.package.people_count,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        package_type: {
          id: item.package.package_type.id,
          name: item.package.package_type.name,
        },
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      package_type: {
        id: item.package_type.id,
        name: item.package_type.name,
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      created_at: item.created_at,
    })),
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
};

