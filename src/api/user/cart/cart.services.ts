import prisma from "../../../lib/prisma";

/**
 * Get or create cart for a user
 */
const getOrCreateCart = async (userId: string) => {
  // Validate userId exists
  if (!userId) {
    throw new Error("User authentication required. Please log in to continue.");
  }

  // Verify user exists in database
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error("User account not found. Please log in again.");
  }

  let cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        user_id: userId,
      },
    });
  }

  return cart;
};

/**
 * Create a cart item
 */
export interface CreateCartItemInput {
  package_id: string;
  location?: string;
  guests?: number;
  date?: Date;
  event_time?: string;
  event_type?: string;
  area?: string;
  price_at_time?: number;
}

export const createCartItem = async (
  userId: string,
  input: CreateCartItemInput
) => {
  // Verify package exists and is available
  const packageData = await prisma.package.findFirst({
    where: {
      id: input.package_id,
      is_active: true,
      is_available: true,
    },
  });

  if (!packageData) {
    throw new Error("Package not found or not available");
  }

  // Get or create cart
  const cart = await getOrCreateCart(userId);

  // Check if cart item already exists for this package
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cart_id_package_id: {
        cart_id: cart.id,
        package_id: input.package_id,
      },
    },
  });

  if (existingItem) {
    throw new Error("Package already exists in cart. Use update endpoint to modify it.");
  }

  // Use package price if price_at_time not provided
  const price = input.price_at_time
    ? input.price_at_time
    : Number(packageData.total_price);

  // Create cart item
  const cartItem = await prisma.cartItem.create({
    data: {
      cart_id: cart.id,
      package_id: input.package_id,
      location: input.location,
      guests: input.guests,
      date: input.date,
      event_time: input.event_time,
      event_type: input.event_type,
      area: input.area,
      price_at_time: price,
    },
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
    },
  });

  return {
    id: cartItem.id,
    package: {
      id: cartItem.package.id,
      name: cartItem.package.name,
      people_count: cartItem.package.minimum_people,
      total_price: Number(cartItem.package.total_price),
      currency: cartItem.package.currency,
      cover_image_url: cartItem.package.cover_image_url,
      caterer: {
        id: cartItem.package.caterer.id,
        business_name: cartItem.package.caterer.catererinfo?.business_name || null,
      },
    },
    location: cartItem.location,
    guests: cartItem.guests,
    date: cartItem.date,
    event_time: cartItem.event_time,
    event_type: cartItem.event_type,
    area: cartItem.area,
    price_at_time: cartItem.price_at_time ? Number(cartItem.price_at_time) : null,
    created_at: cartItem.created_at,
    updated_at: cartItem.updated_at,
  };
};

/**
 * Update a cart item
 */
export interface UpdateCartItemInput {
  location?: string;
  guests?: number;
  date?: Date;
  event_time?: string;
  event_type?: string;
  area?: string;
  price_at_time?: number;
}

export const updateCartItem = async (
  userId: string,
  cartItemId: string,
  input: UpdateCartItemInput
) => {
  // Verify cart item belongs to user
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart_id: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Update cart item
  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      location: input.location !== undefined ? input.location : cartItem.location,
      guests: input.guests !== undefined ? input.guests : cartItem.guests,
      date: input.date !== undefined ? input.date : cartItem.date,
      event_time: input.event_time !== undefined ? input.event_time : cartItem.event_time,
      event_type: input.event_type !== undefined ? input.event_type : cartItem.event_type,
      area: input.area !== undefined ? input.area : cartItem.area,
      price_at_time:
        input.price_at_time !== undefined
          ? input.price_at_time
          : cartItem.price_at_time,
    },
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
    },
  });

  return {
    id: updatedCartItem.id,
    package: {
      id: updatedCartItem.package.id,
      name: updatedCartItem.package.name,
      people_count: updatedCartItem.package.minimum_people,
      total_price: Number(updatedCartItem.package.total_price),
      currency: updatedCartItem.package.currency,
      cover_image_url: updatedCartItem.package.cover_image_url,
      caterer: {
        id: updatedCartItem.package.caterer.id,
        business_name: updatedCartItem.package.caterer.catererinfo?.business_name || null,
      },
    },
    location: updatedCartItem.location,
    guests: updatedCartItem.guests,
    date: updatedCartItem.date,
    event_time: updatedCartItem.event_time,
    event_type: updatedCartItem.event_type,
    area: updatedCartItem.area,
    price_at_time: updatedCartItem.price_at_time
      ? Number(updatedCartItem.price_at_time)
      : null,
    created_at: updatedCartItem.created_at,
    updated_at: updatedCartItem.updated_at,
  };
};

/**
 * Delete a cart item
 */
export const deleteCartItem = async (userId: string, cartItemId: string) => {
  // Verify cart item belongs to user
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart_id: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { success: true, message: "Cart item deleted successfully" };
};

/**
 * Get all cart items for a user
 */
export const getCartItems = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
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
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  if (!cart) {
    return [];
  }

  return cart.items.map((item) => ({
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
    event_time: item.event_time,
    event_type: item.event_type,
    area: item.area,
    price_at_time: item.price_at_time ? Number(item.price_at_time) : null,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
};

