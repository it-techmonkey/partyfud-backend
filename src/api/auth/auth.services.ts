import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { UserType } from "../../generated/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface SignupData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  company_name?: string;
  type: UserType;
  image_url?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  type: UserType;
}

/**
 * Sign up a new user
 */
export const signup = async (data: SignupData) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      company_name: true,
      type: true,
      created_at: true,
    },
  });

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    type: user.type,
  });

  return {
    user,
    token,
  };
};

/**
 * Login user
 */
export const login = async (data: LoginData) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    type: user.type,
  });

  // Return user data (excluding password)
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  // Type assertion needed due to jsonwebtoken type definitions
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as any);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      company_name: true,
      image_url: true,
      type: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export interface CatererInfoData {
  business_name: string;
  business_type: string;
  business_description?: string;
  service_area?: string;
  minimum_guests?: number;
  maximum_guests?: number;
  cuisine_types: string[];
  region?: string;
  delivery_only?: boolean;
  delivery_plus_setup?: boolean;
  full_service?: boolean;
  staff?: number;
  servers?: number;
  food_license?: string[];
  Registration?: string[];
  caterer_id: string;
}

/**
 * Create or update caterer info
 */
export const createCatererInfo = async (data: CatererInfoData) => {
  // Check if user exists and is a caterer
  const user = await prisma.user.findUnique({
    where: { id: data.caterer_id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.type !== "CATERER") {
    throw new Error("Only caterers can create caterer info");
  }

  // Check if caterer info already exists
  const existingCatererInfo = await prisma.catererinfo.findUnique({
    where: { caterer_id: data.caterer_id },
  });

  if (existingCatererInfo) {
    throw new Error("Caterer info already exists. Use update endpoint instead.");
  }

  // Create caterer info
  const catererInfo = await prisma.catererinfo.create({
    data: {
      business_name: data.business_name,
      business_type: data.business_type,
      business_description: data.business_description,
      service_area: data.service_area,
      minimum_guests: data.minimum_guests,
      maximum_guests: data.maximum_guests,
      cuisine_types: data.cuisine_types,
      region: data.region,
      delivery_only: data.delivery_only ?? true,
      delivery_plus_setup: data.delivery_plus_setup ?? true,
      full_service: data.full_service ?? true,
      staff: data.staff,
      servers: data.servers,
      food_license: (data.food_license || []) as any,
      Registration: (data.Registration || []) as any,
      caterer_id: data.caterer_id,
    } as any,
    include: {
      caterer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          company_name: true,
          image_url: true,
          type: true,
        },
      },
    },
  });

  return catererInfo;
};

