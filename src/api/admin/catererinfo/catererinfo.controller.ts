import { Request, Response, NextFunction } from "express";
import { getAllCatererInfo, CatererInfoFilters, getCatererInfoById, updateCatererInfoById, UpdateCatererInfoData } from "./catererinfo.services";
import { Status } from "../../../generated/prisma/client";
import { uploadFileToCloudinary } from "../../../lib/cloudinary";

/**
 * Get all caterer info
 * GET /api/admin/catererinfo
 * Query params: ?status=PENDING|APPROVED|REJECTED
 */
export const getCatererInfoList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔵 [GET CATERER INFO] Request received');
    console.log('🔵 [GET CATERER INFO] Query params:', req.query);

    // Extract status filter from query params
    const statusParam = req.query.status as string;
    const filters: CatererInfoFilters = {};

    if (statusParam) {
      // Validate status value
      const validStatuses: Status[] = ["PENDING", "APPROVED", "REJECTED", "BLOCKED"];
      if (validStatuses.includes(statusParam as Status)) {
        filters.status = statusParam as Status;
        console.log('🔵 [GET CATERER INFO] Filtering by status:', filters.status);
      } else {
        console.log('⚠️ [GET CATERER INFO] Invalid status value:', statusParam);
        res.status(400).json({
          success: false,
          error: {
            message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          },
        });
        return;
      }
    }

    console.log('🔵 [GET CATERER INFO] Fetching caterer info with filters:', filters);
    const catererInfoList = await getAllCatererInfo(filters);
    console.log('✅ [GET CATERER INFO] Found', catererInfoList.length, 'caterer info records');

    res.status(200).json({
      success: true,
      data: catererInfoList,
      count: catererInfoList.length,
    });
  } catch (error: any) {
    console.log('❌ [GET CATERER INFO] Error occurred:', error.message);
    console.log('❌ [GET CATERER INFO] Error stack:', error.stack);
    next(error);
  }
};

/**
 * Get caterer info by ID
 * GET /api/admin/catererinfo/:id
 */
export const getCatererInfoByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('🔵 [GET CATERER INFO BY ID] Request received for ID:', id);

    const catererInfo = await getCatererInfoById(id);

    if (!catererInfo) {
      console.log('❌ [GET CATERER INFO BY ID] Caterer info not found');
      res.status(404).json({
        success: false,
        error: {
          message: "Caterer info not found",
        },
      });
      return;
    }

    console.log('✅ [GET CATERER INFO BY ID] Caterer info found');
    res.status(200).json({
      success: true,
      data: catererInfo,
    });
  } catch (error: any) {
    console.log('❌ [GET CATERER INFO BY ID] Error occurred:', error.message);
    console.log('❌ [GET CATERER INFO BY ID] Error stack:', error.stack);
    next(error);
  }
};

/**
 * Update caterer info by ID
 * PUT /api/admin/catererinfo/:id
 * Can update any field including status
 */
export const updateCatererInfoByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('🟡 [UPDATE CATERER INFO BY ID] Request received for ID:', id);
    console.log('🟡 [UPDATE CATERER INFO BY ID] Request body:', req.body);
    console.log('🟡 [UPDATE CATERER INFO BY ID] Files:', (req as any).files);

    // Check if caterer info exists
    const existingCatererInfo = await getCatererInfoById(id);
    if (!existingCatererInfo) {
      console.log('❌ [UPDATE CATERER INFO BY ID] Caterer info not found');
      res.status(404).json({
        success: false,
        error: {
          message: "Caterer info not found",
        },
      });
      return;
    }

    const {
      business_name,
      business_type,
      business_description,
      service_area,
      minimum_guests,
      maximum_guests,
      region,
      delivery_only,
      delivery_plus_setup,
      full_service,
      staff,
      servers,
      commission_rate,
      status,
    } = req.body;

    const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Prepare update data
    const updateData: UpdateCatererInfoData = {};

    // Handle text fields
    if (business_name !== undefined) updateData.business_name = business_name;
    if (business_type !== undefined) updateData.business_type = business_type;
    if (business_description !== undefined) updateData.business_description = business_description;
    if (service_area !== undefined) updateData.service_area = service_area;
    if (minimum_guests !== undefined) updateData.minimum_guests = parseInt(minimum_guests);
    if (maximum_guests !== undefined) updateData.maximum_guests = parseInt(maximum_guests);
    if (region !== undefined) updateData.region = region;
    if (delivery_only !== undefined) updateData.delivery_only = delivery_only === "true" || delivery_only === true;
    if (delivery_plus_setup !== undefined) updateData.delivery_plus_setup = delivery_plus_setup === "true" || delivery_plus_setup === true;
    if (full_service !== undefined) updateData.full_service = full_service === "true" || full_service === true;
    if (staff !== undefined) updateData.staff = parseInt(staff);
    if (servers !== undefined) updateData.servers = parseInt(servers);
    if (commission_rate !== undefined) updateData.commission_rate = parseInt(commission_rate);
    if (status !== undefined) {
      // Validate status value
      const validStatuses: Status[] = ["PENDING", "APPROVED", "REJECTED", "BLOCKED"];
      if (validStatuses.includes(status as Status)) {
        updateData.status = status as Status;
      } else {
        console.log('⚠️ [UPDATE CATERER INFO BY ID] Invalid status value:', status);
        res.status(400).json({
          success: false,
          error: {
            message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          },
        });
        return;
      }
    }

    // Handle file uploads
    // Preserve existing URLs if files are not provided
    if (files?.food_license) {
      const fileArray = Array.isArray(files.food_license) ? files.food_license : [files.food_license];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        console.log('🟡 [UPDATE CATERER INFO BY ID] Processing food_license file upload...');
        try {
          const url = await uploadFileToCloudinary(file, "partyfud/caterer-documents/food-license");
          updateData.food_license = url;
          console.log('✅ [UPDATE CATERER INFO BY ID] Food license uploaded:', url);
        } catch (uploadError: any) {
          console.log('❌ [UPDATE CATERER INFO BY ID] Food license upload failed:', uploadError.message);
          res.status(400).json({
            success: false,
            error: {
              message: `Food license upload failed: ${uploadError.message}`,
            },
          });
          return;
        }
      }
    } else if (req.body.food_license) {
      // If URL is provided directly in body, use it
      updateData.food_license = req.body.food_license;
    }

    if (files?.Registration) {
      const fileArray = Array.isArray(files.Registration) ? files.Registration : [files.Registration];
      if (fileArray.length > 0) {
        const file = fileArray[0];
        console.log('🟡 [UPDATE CATERER INFO BY ID] Processing Registration file upload...');
        try {
          const url = await uploadFileToCloudinary(file, "partyfud/caterer-documents/registration");
          updateData.Registration = url;
          console.log('✅ [UPDATE CATERER INFO BY ID] Registration uploaded:', url);
        } catch (uploadError: any) {
          console.log('❌ [UPDATE CATERER INFO BY ID] Registration upload failed:', uploadError.message);
          res.status(400).json({
            success: false,
            error: {
              message: `Registration upload failed: ${uploadError.message}`,
            },
          });
          return;
        }
      }
    } else if (req.body.Registration) {
      // If URL is provided directly in body, use it
      updateData.Registration = req.body.Registration;
    }

    console.log('🟡 [UPDATE CATERER INFO BY ID] Updating caterer info with data:', updateData);
    const updatedCatererInfo = await updateCatererInfoById(id, updateData);
    console.log('✅ [UPDATE CATERER INFO BY ID] Caterer info updated successfully');

    res.status(200).json({
      success: true,
      data: updatedCatererInfo,
      message: "Caterer info updated successfully",
    });
  } catch (error: any) {
    console.log('❌ [UPDATE CATERER INFO BY ID] Error occurred:', error.message);
    console.log('❌ [UPDATE CATERER INFO BY ID] Error stack:', error.stack);
    next(error);
  }
};

