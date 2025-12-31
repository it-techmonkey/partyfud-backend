import prisma from "../../../lib/prisma";
import { Status } from "../../../generated/prisma/client";

export interface CatererInfoFilters {
  status?: Status;
}

export interface UpdateCatererInfoData {
  business_name?: string;
  business_type?: string;
  business_description?: string;
  service_area?: string;
  minimum_guests?: number;
  maximum_guests?: number;
  region?: string;
  delivery_only?: boolean;
  delivery_plus_setup?: boolean;
  full_service?: boolean;
  staff?: number;
  servers?: number;
  food_license?: string;
  Registration?: string;
  status?: Status;
}

/**
 * Get all caterer info with optional status filtering
 */
export const getAllCatererInfo = async (filters?: CatererInfoFilters) => {
  const where: any = {};

  // Add status filter if provided
  if (filters?.status) {
    where.status = filters.status;
  }

  const catererInfoList = await prisma.catererinfo.findMany({
    where,
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
          profile_completed: true,
          verified: true,
          created_at: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return catererInfoList;
};

/**
 * Get caterer info by ID
 */
export const getCatererInfoById = async (id: string) => {
  const catererInfo = await prisma.catererinfo.findUnique({
    where: { id },
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
          profile_completed: true,
          verified: true,
          created_at: true,
        },
      },
    },
  });

  return catererInfo;
};

/**
 * Update caterer info by ID
 */
export const updateCatererInfoById = async (id: string, data: UpdateCatererInfoData) => {
  // Build update object with only provided fields
  const updateData: any = {};

  if (data.business_name !== undefined) updateData.business_name = data.business_name;
  if (data.business_type !== undefined) updateData.business_type = data.business_type;
  if (data.business_description !== undefined) updateData.business_description = data.business_description;
  if (data.service_area !== undefined) updateData.service_area = data.service_area;
  if (data.minimum_guests !== undefined) updateData.minimum_guests = data.minimum_guests;
  if (data.maximum_guests !== undefined) updateData.maximum_guests = data.maximum_guests;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.delivery_only !== undefined) updateData.delivery_only = data.delivery_only;
  if (data.delivery_plus_setup !== undefined) updateData.delivery_plus_setup = data.delivery_plus_setup;
  if (data.full_service !== undefined) updateData.full_service = data.full_service;
  if (data.staff !== undefined) updateData.staff = data.staff;
  if (data.servers !== undefined) updateData.servers = data.servers;
  if (data.food_license !== undefined) updateData.food_license = data.food_license;
  if (data.Registration !== undefined) updateData.Registration = data.Registration;
  if (data.status !== undefined) updateData.status = data.status;

  const updatedCatererInfo = await prisma.catererinfo.update({
    where: { id },
    data: updateData,
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
          profile_completed: true,
          verified: true,
          created_at: true,
        },
      },
    },
  });

  return updatedCatererInfo;
};

