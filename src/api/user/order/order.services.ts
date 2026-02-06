import prisma from "../../../lib/prisma";
import { sendOrderConfirmationEmail, OrderConfirmationData } from "../../../lib/email";

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
    add_ons?: Array<{
      add_on_id: string;
      quantity?: number;
      price_at_time: number;
    }>;
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
            add_ons: {
              include: {
                add_on: true,
              },
            },
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
      add_ons: item.add_ons ? item.add_ons.map(cia => ({
        add_on_id: cia.add_on_id,
        quantity: cia.quantity,
        price_at_time: cia.price_at_time ? Number(cia.price_at_time) : Number(cia.add_on.price),
      })) : [],
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
            add_ons: item.add_ons && item.add_ons.length > 0 ? {
              create: item.add_ons.map(addOn => ({
                add_on_id: addOn.add_on_id,
                quantity: addOn.quantity || 1,
                price_at_time: addOn.price_at_time,
              })),
            } : undefined,
          })),
        },
      },
      include: {
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

  // Send order confirmation email
  try {
    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.email) {
      // Get the first caterer from order items (assuming all items are from same caterer)
      const firstItem = order.items[0];
      const caterer = firstItem?.package?.caterer;
      const catererInfo = caterer?.catererinfo;

      // Format invoice number (use first 8 characters of order ID)
      const invoiceNo = order.id.substring(0, 8).toUpperCase();

      // Format date
      const orderDate = new Date(order.created_at);
      const formattedDate = orderDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Calculate items for email
      const emailItems: OrderConfirmationData['items'] = [];
      let addOnsTotal = 0;

      for (const item of order.items) {
        // Add package item
        emailItems.push({
          description: item.package.name,
          unitPrice: Number(item.price_at_time),
          quantity: 1,
          total: Number(item.price_at_time),
        });

        // Add add-ons if any
        if (item.add_ons && item.add_ons.length > 0) {
          for (const addOn of item.add_ons) {
            const addOnTotal = Number(addOn.price_at_time) * (addOn.quantity || 1);
            addOnsTotal += addOnTotal;
            emailItems.push({
              description: `${addOn.add_on.name} (Add-on)`,
              unitPrice: Number(addOn.price_at_time),
              quantity: addOn.quantity || 1,
              total: addOnTotal,
            });
          }
        }
      }

      // Calculate totals
      const subtotal = Number(order.total_price);
      const taxRate = 10; // 10% tax as per PDF
      const tax = Math.round(subtotal * (taxRate / 100));
      const total = subtotal + tax;

      const emailData: OrderConfirmationData = {
        invoiceNo,
        date: formattedDate,
        user: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          company: user.company_name || undefined,
          address: undefined, // Add address if available in user model
        },
        caterer: {
          name: catererInfo?.business_name || caterer?.first_name + ' ' + caterer?.last_name || 'Party Fud',
          company: catererInfo?.business_name || undefined,
          address: catererInfo?.service_area || undefined,
        },
        items: emailItems,
        subtotal,
        tax,
        taxRate,
        total,
        currency: order.currency,
      };

      // Send email asynchronously (don't wait for it)
      sendOrderConfirmationEmail(emailData).catch((error) => {
        console.error('Failed to send order confirmation email:', error);
      });

      // Send new order notification email to caterer(s)
      try {
        const { sendNewOrderNotificationEmail } = await import('../../../lib/email');
        type NewOrderNotificationData = import('../../../lib/email').NewOrderNotificationData;
        
        // Group order items by caterer
        const catererOrders = new Map<string, typeof order.items>();
        for (const item of order.items) {
          const catererId = item.package.caterer.id;
          if (!catererOrders.has(catererId)) {
            catererOrders.set(catererId, []);
          }
          catererOrders.get(catererId)!.push(item);
        }

        // Send email to each caterer
        for (const [catererId, items] of Array.from(catererOrders.entries())) {
          const firstItem = items[0];
          const caterer = firstItem.package.caterer;
          const catererInfo = caterer.catererinfo;
          
          if (caterer.email) {
            // Format invoice number
            const invoiceNo = order.id.substring(0, 8).toUpperCase();
            
            // Format date
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            // Prepare items for email
            const emailItems: NewOrderNotificationData['items'] = [];
            for (const item of items) {
              emailItems.push({
                description: item.package.name,
                quantity: 1,
                price: Number(item.price_at_time),
              });

              // Add add-ons if any
              if (item.add_ons && item.add_ons.length > 0) {
                for (const addOn of item.add_ons) {
                  emailItems.push({
                    description: `${addOn.add_on.name} (Add-on)`,
                    quantity: addOn.quantity || 1,
                    price: Number(addOn.price_at_time) * (addOn.quantity || 1),
                  });
                }
              }
            }

            // Calculate total for this caterer's items
            const catererTotal = items.reduce((sum, item) => sum + Number(item.price_at_time), 0);

            // Generate order URL
            const frontendUrl = process.env.FRONTEND_URL || 'https://uae.partyfud.com';
            const orderUrl = `${frontendUrl}/caterer/orders`;

            const notificationData: NewOrderNotificationData = {
              orderNumber: invoiceNo,
              orderDate: formattedDate,
              catererEmail: caterer.email,
              catererName: catererInfo?.business_name || `${caterer.first_name} ${caterer.last_name}`,
              customerName: `${user.first_name} ${user.last_name}`,
              customerEmail: user.email,
              customerPhone: user.phone || undefined,
              packageName: items.length === 1 ? items[0].package.name : `${items.length} Packages`,
              guestCount: items[0].guests || 1,
              eventDate: items[0].date ? new Date(items[0].date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }) : undefined,
              eventTime: items[0].event_time || undefined,
              location: items[0].location || undefined,
              totalPrice: catererTotal,
              currency: order.currency,
              items: emailItems,
              orderUrl,
            };

            sendNewOrderNotificationEmail(notificationData).catch((error) => {
              console.error('Failed to send new order notification email to caterer:', error);
            });
          }
        }
      } catch (error) {
        console.error('Error preparing new order notification email:', error);
        // Don't throw - email failure shouldn't break order creation
      }
    }
  } catch (error) {
    console.error('Error preparing order confirmation email:', error);
    // Don't throw - email failure shouldn't break order creation
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
        people_count: item.package.minimum_people,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      add_ons: item.add_ons ? item.add_ons.map(oia => ({
        id: oia.id,
        add_on_id: oia.add_on_id,
        quantity: oia.quantity,
        price_at_time: Number(oia.price_at_time),
        add_on: {
          id: oia.add_on.id,
          name: oia.add_on.name,
          description: oia.add_on.description,
          price: Number(oia.add_on.price),
          currency: oia.add_on.currency,
        },
      })) : [],
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
        people_count: item.package.minimum_people,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      add_ons: item.add_ons ? item.add_ons.map(oia => ({
        id: oia.id,
        add_on_id: oia.add_on_id,
        quantity: oia.quantity,
        price_at_time: Number(oia.price_at_time),
        add_on: {
          id: oia.add_on.id,
          name: oia.add_on.name,
          description: oia.add_on.description,
          price: Number(oia.add_on.price),
          currency: oia.add_on.currency,
        },
      })) : [],
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
        people_count: item.package.minimum_people,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      add_ons: item.add_ons ? item.add_ons.map(oia => ({
        id: oia.id,
        add_on_id: oia.add_on_id,
        quantity: oia.quantity,
        price_at_time: Number(oia.price_at_time),
        add_on: {
          id: oia.add_on.id,
          name: oia.add_on.name,
          description: oia.add_on.description,
          price: Number(oia.add_on.price),
          currency: oia.add_on.currency,
        },
      })) : [],
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
        people_count: item.package.minimum_people,
        total_price: Number(item.package.total_price),
        currency: item.package.currency,
        cover_image_url: item.package.cover_image_url,
        caterer: {
          id: item.package.caterer.id,
          business_name: item.package.caterer.catererinfo?.business_name || null,
        },
      },
      location: item.location,
      guests: item.guests,
      date: item.date,
      price_at_time: Number(item.price_at_time),
      add_ons: item.add_ons ? item.add_ons.map(oia => ({
        id: oia.id,
        add_on_id: oia.add_on_id,
        quantity: oia.quantity,
        price_at_time: Number(oia.price_at_time),
        add_on: {
          id: oia.add_on.id,
          name: oia.add_on.name,
          description: oia.add_on.description,
          price: Number(oia.add_on.price),
          currency: oia.add_on.currency,
        },
      })) : [],
      created_at: item.created_at,
    })),
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
};

