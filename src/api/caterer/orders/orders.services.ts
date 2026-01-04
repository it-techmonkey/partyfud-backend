import prisma from "../../../lib/prisma";

/**
 * Get all orders for a caterer
 * Orders are included if they have at least one item with a package from this caterer
 */
export const getOrdersForCaterer = async (catererId: string) => {
  // Get all order IDs that have items with packages from this caterer
  const orderItems = await prisma.orderItem.findMany({
    where: {
      package: {
        caterer_id: catererId,
      },
    },
    select: {
      order_id: true,
    },
    distinct: ['order_id'],
  });

  const orderIds = orderItems.map((item) => item.order_id);

  if (orderIds.length === 0) {
    return [];
  }

  // Get all orders with their items
  const orders = await prisma.order.findMany({
    where: {
      id: { in: orderIds },
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
        where: {
          package: {
            caterer_id: catererId,
          },
        },
        include: {
          package: {
            include: {
              package_type: true,
              caterer: {
                include: {
                  catererinfo: true,
                },
              },
              items: {
                include: {
                  dish: {
                    include: {
                      category: true,
                      cuisine_type: true,
                    },
                  },
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
    user: {
      id: order.user.id,
      name: `${order.user.first_name} ${order.user.last_name}`,
      email: order.user.email,
      phone: order.user.phone,
    },
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
        package_items: item.package.items.map((pi) => ({
          id: pi.id,
          dish: {
            id: pi.dish.id,
            name: pi.dish.name,
            image_url: pi.dish.image_url,
            price: Number(pi.dish.price),
            currency: pi.dish.currency,
            category: {
              id: pi.dish.category.id,
              name: pi.dish.category.name,
            },
            cuisine_type: {
              id: pi.dish.cuisine_type.id,
              name: pi.dish.cuisine_type.name,
            },
          },
          quantity: pi.quantity,
          is_optional: pi.is_optional,
          is_addon: pi.is_addon,
          people_count: pi.people_count,
        })),
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
 * Get a single order by ID for a caterer
 * Only returns the order if it has at least one item with a package from this caterer
 */
export const getOrderByIdForCaterer = async (catererId: string, orderId: string) => {
  // First verify the order has items from this caterer
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      order_id: orderId,
      package: {
        caterer_id: catererId,
      },
    },
  });

  if (!orderItem) {
    throw new Error("Order not found or does not belong to this caterer");
  }

  // Get the full order with all items (but we'll filter to show only this caterer's items)
  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
        where: {
          package: {
            caterer_id: catererId,
          },
        },
        include: {
          package: {
            include: {
              package_type: true,
              caterer: {
                include: {
                  catererinfo: true,
                },
              },
              items: {
                include: {
                  dish: {
                    include: {
                      category: true,
                      cuisine_type: true,
                    },
                  },
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
    user: {
      id: order.user.id,
      name: `${order.user.first_name} ${order.user.last_name}`,
      email: order.user.email,
      phone: order.user.phone,
    },
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
        package_items: item.package.items.map((pi) => ({
          id: pi.id,
          dish: {
            id: pi.dish.id,
            name: pi.dish.name,
            image_url: pi.dish.image_url,
            price: Number(pi.dish.price),
            currency: pi.dish.currency,
            category: {
              id: pi.dish.category.id,
              name: pi.dish.category.name,
            },
            cuisine_type: {
              id: pi.dish.cuisine_type.id,
              name: pi.dish.cuisine_type.name,
            },
          },
          quantity: pi.quantity,
          is_optional: pi.is_optional,
          is_addon: pi.is_addon,
          people_count: pi.people_count,
        })),
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
 * Update order status
 * Only allows updating orders that have items from this caterer
 */
export interface UpdateOrderStatusInput {
  status: "PENDING" | "CONFIRMED" | "PAID" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
}

export const updateOrderStatus = async (
  catererId: string,
  orderId: string,
  input: UpdateOrderStatusInput
) => {
  // Verify order has items from this caterer
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      order_id: orderId,
      package: {
        caterer_id: catererId,
      },
    },
    include: {
      order: true,
    },
  });

  if (!orderItem) {
    throw new Error("Order not found or does not belong to this caterer");
  }

  // Don't allow status changes if order is already delivered or cancelled
  if (
    orderItem.order.status === "DELIVERED" ||
    orderItem.order.status === "CANCELLED"
  ) {
    throw new Error(
      `Cannot update order with status ${orderItem.order.status}`
    );
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: input.status,
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
        where: {
          package: {
            caterer_id: catererId,
          },
        },
        include: {
          package: {
            include: {
              package_type: true,
              caterer: {
                include: {
                  catererinfo: true,
                },
              },
              items: {
                include: {
                  dish: {
                    include: {
                      category: true,
                      cuisine_type: true,
                    },
                  },
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
    user: {
      id: updatedOrder.user.id,
      name: `${updatedOrder.user.first_name} ${updatedOrder.user.last_name}`,
      email: updatedOrder.user.email,
      phone: updatedOrder.user.phone,
    },
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
        package_items: item.package.items.map((pi) => ({
          id: pi.id,
          dish: {
            id: pi.dish.id,
            name: pi.dish.name,
            image_url: pi.dish.image_url,
            price: Number(pi.dish.price),
            currency: pi.dish.currency,
            category: {
              id: pi.dish.category.id,
              name: pi.dish.category.name,
            },
            cuisine_type: {
              id: pi.dish.cuisine_type.id,
              name: pi.dish.cuisine_type.name,
            },
          },
          quantity: pi.quantity,
          is_optional: pi.is_optional,
          is_addon: pi.is_addon,
          people_count: pi.people_count,
        })),
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

