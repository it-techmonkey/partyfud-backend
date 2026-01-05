import prisma from "../../../lib/prisma";

/**
 * Get all occasions
 */
export const getAllOccasions = async () => {
  const occasions = await prisma.occassion.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return occasions.map((occasion) => ({
    id: occasion.id,
    name: occasion.name,
    image_url: occasion.image_url,
    description: occasion.description,
    created_at: occasion.created_at,
    updated_at: occasion.updated_at,
  }));
};

/**
 * Get occasion by ID
 */
export const getOccasionById = async (occasionId: string) => {
  const occasion = await prisma.occassion.findUnique({
    where: {
      id: occasionId,
    },
  });

  if (!occasion) {
    throw new Error("Occasion not found");
  }

  return {
    id: occasion.id,
    name: occasion.name,
    image_url: occasion.image_url,
    description: occasion.description,
    created_at: occasion.created_at,
    updated_at: occasion.updated_at,
  };
};

