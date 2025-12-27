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

