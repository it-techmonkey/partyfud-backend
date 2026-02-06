import prisma from "../../../lib/prisma";

interface OnboardingData {
  business_name: string;
  business_type?: string;
  business_description?: string;
  region?: string | string[];
  service_area?: string;
  minimum_guests?: number;
  maximum_guests?: number;
  cuisine_types?: string[];
  unavailable_dates?: string[];
  certifications?: string[];
  delivery_only?: boolean;
  delivery_plus_setup?: boolean;
  full_service?: boolean;
  preparation_time?: number;
  staff?: number;
  servers?: number;
  food_license?: string;
  Registration?: string;
}

/**
 * Save onboarding draft
 */
export const saveDraft = async (userId: string, data: OnboardingData) => {
  // Normalize region to array format
  const regionArray = Array.isArray(data.region) 
    ? data.region 
    : (data.region ? [data.region] : []);

  // Use upsert to create or update caterer info
  // This handles both first-time onboarding and updating existing drafts
  const updated = await prisma.catererinfo.upsert({
    where: { caterer_id: userId },
    create: {
      caterer_id: userId,
      business_name: data.business_name || "Draft",
      business_type: data.business_type || "Not Specified",
      business_description: data.business_description,
      region: regionArray,
      service_area: data.service_area,
      minimum_guests: data.minimum_guests,
      maximum_guests: data.maximum_guests,
      cuisine_types: data.cuisine_types || [],
      unavailable_dates: data.unavailable_dates || [],
      delivery_only: data.delivery_only ?? true,
      delivery_plus_setup: data.delivery_plus_setup ?? true,
      full_service: data.full_service ?? true,
      preparation_time: data.preparation_time || 24,
      staff: data.staff || 0,
      servers: data.servers || 0,
      food_license: data.food_license,
      Registration: data.Registration,
      has_draft: true,
      onboarding_step: 4,
      status: "PENDING",
    },
    update: {
      business_name: data.business_name || "Draft",
      business_type: data.business_type || "Not Specified",
      business_description: data.business_description,
      region: regionArray,
      service_area: data.service_area,
      minimum_guests: data.minimum_guests,
      maximum_guests: data.maximum_guests,
      cuisine_types: data.cuisine_types || [],
      unavailable_dates: data.unavailable_dates || [],
      delivery_only: data.delivery_only ?? true,
      delivery_plus_setup: data.delivery_plus_setup ?? true,
      full_service: data.full_service ?? true,
      preparation_time: data.preparation_time || 24,
      staff: data.staff || 0,
      servers: data.servers || 0,
      food_license: data.food_license,
      Registration: data.Registration,
      has_draft: true,
      onboarding_step: 4,
    },
  });

  // Handle certifications if provided
  if (data.certifications && data.certifications.length > 0) {
    // Delete existing certifications
    await prisma.catererCertification.deleteMany({
      where: { caterer_info_id: updated.id },
    });

    // Create new ones
    for (const certName of data.certifications) {
      // Find or create certification
      let certification = await prisma.certification.findFirst({
        where: { name: certName },
      });

      if (!certification) {
        certification = await prisma.certification.create({
          data: { name: certName },
        });
      }

      // Link to caterer
      await prisma.catererCertification.create({
        data: {
          caterer_info_id: updated.id,
          certification_id: certification.id,
        },
      });
    }
  }

  return updated;
};

/**
 * Submit onboarding for approval
 */
export const submit = async (userId: string, data: OnboardingData) => {
  // Normalize region to array format
  const regionArray = Array.isArray(data.region) 
    ? data.region 
    : (data.region ? [data.region] : []);

  // Validate required fields for final submission
  if (!data.business_name || regionArray.length === 0 || !data.minimum_guests || !data.maximum_guests) {
    throw new Error("Missing required fields: business_name, region, minimum_guests, and maximum_guests are required");
  }

  // Use upsert to create or update caterer info
  const updated = await prisma.catererinfo.upsert({
    where: { caterer_id: userId },
    create: {
      caterer_id: userId,
      business_name: data.business_name,
      business_type: data.business_type || "Not Specified",
      business_description: data.business_description,
      region: regionArray,
      service_area: data.service_area,
      minimum_guests: data.minimum_guests,
      maximum_guests: data.maximum_guests,
      cuisine_types: data.cuisine_types || [],
      unavailable_dates: data.unavailable_dates || [],
      delivery_only: data.delivery_only ?? true,
      delivery_plus_setup: data.delivery_plus_setup ?? true,
      full_service: data.full_service ?? true,
      preparation_time: data.preparation_time || 24,
      staff: data.staff || 0,
      servers: data.servers || 0,
      food_license: data.food_license,
      Registration: data.Registration,
      status: "PENDING",
      onboarding_completed: true,
      has_draft: false,
      onboarding_step: 4,
    },
    update: {
      business_name: data.business_name,
      business_type: data.business_type || "Not Specified",
      business_description: data.business_description,
      region: regionArray,
      service_area: data.service_area,
      minimum_guests: data.minimum_guests,
      maximum_guests: data.maximum_guests,
      cuisine_types: data.cuisine_types || [],
      unavailable_dates: data.unavailable_dates || [],
      delivery_only: data.delivery_only ?? true,
      delivery_plus_setup: data.delivery_plus_setup ?? true,
      full_service: data.full_service ?? true,
      preparation_time: data.preparation_time || 24,
      staff: data.staff || 0,
      servers: data.servers || 0,
      food_license: data.food_license,
      Registration: data.Registration,
      status: "PENDING",
      onboarding_completed: true,
      has_draft: false,
      onboarding_step: 4,
    },
  });

  // Handle certifications if provided
  if (data.certifications && data.certifications.length > 0) {
    // Delete existing certifications
    await prisma.catererCertification.deleteMany({
      where: { caterer_info_id: updated.id },
    });

    // Create new ones
    for (const certName of data.certifications) {
      // Find or create certification
      let certification = await prisma.certification.findFirst({
        where: { name: certName },
      });

      if (!certification) {
        certification = await prisma.certification.create({
          data: { name: certName },
        });
      }

      // Link to caterer
      await prisma.catererCertification.create({
        data: {
          caterer_info_id: updated.id,
          certification_id: certification.id,
        },
      });
    }
  }

  // Update user type to CATERER and company_name upon successful onboarding submission
  const user = await prisma.user.update({
    where: { id: userId },
    data: { 
      type: "CATERER",
      company_name: data.business_name, // Set company_name from business_name
    },
  });

  // Send onboarding completion email to caterer
  try {
    const { sendOnboardingCompletionEmail } = await import('../../../lib/email');
    const catererName = data.business_name || `${user.first_name} ${user.last_name}`;
    sendOnboardingCompletionEmail(user.email, catererName).catch((error) => {
      console.error('Failed to send onboarding completion email:', error);
    });
  } catch (error) {
    console.error('Error sending onboarding completion email:', error);
  }

  return updated;
};

/**
 * Get onboarding status
 */
export const getStatus = async (userId: string) => {
  const catererInfo = await prisma.catererinfo.findUnique({
    where: { caterer_id: userId },
    include: {
      certifications: {
        include: {
          certification: true,
        },
      },
    },
  });

  if (!catererInfo) {
    return null;
  }

  return {
    status: catererInfo.status,
    onboarding_completed: catererInfo.onboarding_completed,
    onboarding_step: catererInfo.onboarding_step,
    has_draft: catererInfo.has_draft,
    business_name: catererInfo.business_name,
    business_type: catererInfo.business_type,
    business_description: catererInfo.business_description,
    region: catererInfo.region,
    service_area: catererInfo.service_area,
    minimum_guests: catererInfo.minimum_guests,
    maximum_guests: catererInfo.maximum_guests,
    cuisine_types: catererInfo.cuisine_types,
    unavailable_dates: catererInfo.unavailable_dates,
    delivery_only: catererInfo.delivery_only,
    delivery_plus_setup: catererInfo.delivery_plus_setup,
    full_service: catererInfo.full_service,
    preparation_time: catererInfo.preparation_time,
    staff: catererInfo.staff,
    servers: catererInfo.servers,
    certifications: catererInfo.certifications.map(
      (cc) => cc.certification.name
    ),
    food_license: catererInfo.food_license,
    Registration: catererInfo.Registration,
  };
};
