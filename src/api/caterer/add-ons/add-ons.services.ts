import prisma from "../../../lib/prisma";

export interface CreateAddOnData {
  package_id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  is_active?: boolean;
}

export interface UpdateAddOnData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  is_active?: boolean;
}

/**
 * Create a new add-on for a fixed menu package
 */
export const createAddOn = async (
  catererId: string,
  data: CreateAddOnData
) => {
  // Verify caterer exists and is a CATERER type
  const caterer = await prisma.user.findUnique({
    where: { id: catererId },
  });

  if (!caterer || caterer.type !== "CATERER") {
    throw new Error("Invalid caterer");
  }

  // Verify package exists and belongs to the caterer
  const packageData = await prisma.package.findFirst({
    where: {
      id: data.package_id,
      caterer_id: catererId,
    },
  });

  if (!packageData) {
    throw new Error("Package not found or does not belong to this caterer");
  }

  // Verify package is a FIXED menu
  if (packageData.customisation_type !== "FIXED") {
    throw new Error("Add-ons can only be added to FIXED menu packages");
  }

  const addOn = await prisma.addOn.create({
    data: {
      package_id: data.package_id,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency || "AED",
      is_active: data.is_active ?? true,
    },
  });

  return addOn;
};

/**
 * Get all add-ons for a package
 */
export const getAddOnsByPackageId = async (
  packageId: string,
  catererId: string
) => {
  // Verify package exists and belongs to the caterer
  const packageData = await prisma.package.findFirst({
    where: {
      id: packageId,
      caterer_id: catererId,
    },
  });

  if (!packageData) {
    throw new Error("Package not found or does not belong to this caterer");
  }

  const addOns = await prisma.addOn.findMany({
    where: {
      package_id: packageId,
    },
    orderBy: {
      created_at: "asc",
    },
  });

  return addOns;
};

/**
 * Get add-on by ID
 */
export const getAddOnById = async (addOnId: string, catererId: string) => {
  const addOn = await prisma.addOn.findFirst({
    where: {
      id: addOnId,
      package: {
        caterer_id: catererId,
      },
    },
    include: {
      package: true,
    },
  });

  if (!addOn) {
    throw new Error("Add-on not found or does not belong to this caterer");
  }

  return addOn;
};

/**
 * Update an add-on
 */
export const updateAddOn = async (
  addOnId: string,
  catererId: string,
  data: UpdateAddOnData
) => {
  // Verify add-on exists and belongs to the caterer
  const existingAddOn = await prisma.addOn.findFirst({
    where: {
      id: addOnId,
      package: {
        caterer_id: catererId,
      },
    },
  });

  if (!existingAddOn) {
    throw new Error("Add-on not found or does not belong to this caterer");
  }

  const addOn = await prisma.addOn.update({
    where: { id: addOnId },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      is_active: data.is_active,
    },
  });

  return addOn;
};

/**
 * Delete an add-on
 */
export const deleteAddOn = async (addOnId: string, catererId: string) => {
  // Verify add-on exists and belongs to the caterer
  const existingAddOn = await prisma.addOn.findFirst({
    where: {
      id: addOnId,
      package: {
        caterer_id: catererId,
      },
    },
  });

  if (!existingAddOn) {
    throw new Error("Add-on not found or does not belong to this caterer");
  }

  await prisma.addOn.delete({
    where: { id: addOnId },
  });

  return { success: true };
};
