import { Request, Response } from "express";
import prisma from "../../../lib/prisma";

// ============================================================================
// CUISINE TYPES
// ============================================================================

/**
 * Get all cuisine types
 * GET /api/admin/metadata/cuisine-types
 */
export const getCuisineTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cuisineTypes = await prisma.cuisineType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: cuisineTypes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new cuisine type
 * POST /api/admin/metadata/cuisine-types
 */
export const createCuisineType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: {
          message: "Name is required",
        },
      });
      return;
    }

    const cuisineType = await prisma.cuisineType.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: cuisineType,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A cuisine type with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a cuisine type
 * PUT /api/admin/metadata/cuisine-types/:id
 */
export const updateCuisineType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const cuisineType = await prisma.cuisineType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json({
      success: true,
      data: cuisineType,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Cuisine type not found",
        },
      });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A cuisine type with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete a cuisine type
 * DELETE /api/admin/metadata/cuisine-types/:id
 */
export const deleteCuisineType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.cuisineType.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Cuisine type deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Cuisine type not found",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get all categories
 * GET /api/admin/metadata/categories
 */
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new category
 * POST /api/admin/metadata/categories
 */
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: {
          message: "Name is required",
        },
      });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A category with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a category
 * PUT /api/admin/metadata/categories/:id
 */
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Category not found",
        },
      });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A category with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete a category
 * DELETE /api/admin/metadata/categories/:id
 */
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Category not found",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

// ============================================================================
// SUB CATEGORIES
// ============================================================================

/**
 * Get all subcategories (optionally filtered by category)
 * GET /api/admin/metadata/subcategories?category_id=xxx
 */
export const getSubCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category_id = req.query.category_id as string | undefined;

    const where: any = {};
    if (category_id) {
      where.category_id = category_id;
    }

    const subCategories = await prisma.subCategory.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new subcategory
 * POST /api/admin/metadata/subcategories
 */
export const createSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, category_id } = req.body;

    if (!name || !category_id) {
      res.status(400).json({
        success: false,
        error: {
          message: "Name and category_id are required",
        },
      });
      return;
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
        description: description || null,
        category_id,
      },
    });

    res.status(201).json({
      success: true,
      data: subCategory,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A subcategory with this name already exists in this category",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a subcategory
 * PUT /api/admin/metadata/subcategories/:id
 */
export const updateSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, category_id } = req.body;

    const subCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category_id && { category_id }),
      },
    });

    res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Subcategory not found",
        },
      });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A subcategory with this name already exists in this category",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete a subcategory
 * DELETE /api/admin/metadata/subcategories/:id
 */
export const deleteSubCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.subCategory.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Subcategory not found",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

// ============================================================================
// CERTIFICATIONS
// ============================================================================

/**
 * Get all certifications
 * GET /api/admin/metadata/certifications
 */
export const getCertifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: certifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new certification
 * POST /api/admin/metadata/certifications
 */
export const createCertification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: {
          message: "Name is required",
        },
      });
      return;
    }

    const certification = await prisma.certification.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: certification,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A certification with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a certification
 * PUT /api/admin/metadata/certifications/:id
 */
export const updateCertification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json({
      success: true,
      data: certification,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Certification not found",
        },
      });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A certification with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete a certification
 * DELETE /api/admin/metadata/certifications/:id
 */
export const deleteCertification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.certification.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Certification not found",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

// ============================================================================
// OCCASIONS
// ============================================================================

/**
 * Get all occasions
 * GET /api/admin/metadata/occasions
 */
export const getOccasions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const occasions = await prisma.occassion.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: occasions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new occasion
 * POST /api/admin/metadata/occasions
 */
export const createOccasion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: {
          message: "Name is required",
        },
      });
      return;
    }

    const occasion = await prisma.occassion.create({
      data: {
        name,
        description: description || null,
        image_url: image_url || null,
      },
    });

    res.status(201).json({
      success: true,
      data: occasion,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "An occasion with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update an occasion
 * PUT /api/admin/metadata/occasions/:id
 */
export const updateOccasion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    const occasion = await prisma.occassion.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(image_url !== undefined && { image_url }),
      },
    });

    res.status(200).json({
      success: true,
      data: occasion,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Occasion not found",
        },
      });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "An occasion with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete an occasion
 * DELETE /api/admin/metadata/occasions/:id
 */
export const deleteOccasion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.occassion.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Occasion deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Occasion not found",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

// ============================================================================
// FREE FORMS
// ============================================================================

/**
 * Get all free forms
 * GET /api/admin/metadata/freeforms
 */
export const getFreeForms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const freeForms = await prisma.freeForm.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: freeForms,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Create a new free form
 * POST /api/admin/metadata/freeforms
 */
export const createFreeForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: {
          message: "Name is required",
        },
      });
      return;
    }

    const freeForm = await prisma.freeForm.create({
      data: {
        name,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: freeForm,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A free form with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Update a free form
 * PUT /api/admin/metadata/freeforms/:id
 */
export const updateFreeForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const freeForm = await prisma.freeForm.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.status(200).json({
      success: true,
      data: freeForm,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Free form not found",
        },
      });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          message: "A free form with this name already exists",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};

/**
 * Delete a free form
 * DELETE /api/admin/metadata/freeforms/:id
 */
export const deleteFreeForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.freeForm.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Free form deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          message: "Free form not found",
        },
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred",
      },
    });
  }
};
