import prisma from "../../../lib/prisma";

/**
 * Create proposal input interface
 */
export interface CreateProposalInput {
  caterer_id: string;
  event_type?: string;
  location?: string;
  dietary_preferences?: string[];
  budget_per_person?: number;
  event_date?: Date | string;
  vision?: string;
  guest_count: number;
}

/**
 * Create a proposal (lead)
 */
export const createProposal = async (userId: string, input: CreateProposalInput) => {
  // Validate required fields
  if (!input.caterer_id) {
    throw new Error("Caterer ID is required");
  }

  if (!input.guest_count || input.guest_count <= 0) {
    throw new Error("Guest count is required and must be greater than 0");
  }

  // Verify caterer exists and is approved
  const caterer = await prisma.user.findFirst({
    where: {
      id: input.caterer_id,
      type: "CATERER",
      catererinfo: {
        status: "APPROVED",
      },
    },
  });

  if (!caterer) {
    throw new Error("Caterer not found or not approved");
  }

  // Parse event_date if it's a string
  let eventDate: Date | undefined = undefined;
  if (input.event_date) {
    eventDate = typeof input.event_date === 'string' 
      ? new Date(input.event_date) 
      : input.event_date;
  }

  // Create proposal
  const proposal = await prisma.proposal.create({
    data: {
      user_id: userId,
      caterer_id: input.caterer_id,
      event_type: input.event_type || null,
      location: input.location || null,
      dietary_preferences: input.dietary_preferences || [],
      budget_per_person: input.budget_per_person || null,
      event_date: eventDate || null,
      vision: input.vision || null,
      guest_count: input.guest_count,
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
        },
      },
      caterer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          catererinfo: {
            select: {
              business_name: true,
            },
          },
        },
      },
    },
  });

  return {
    id: proposal.id,
    user_id: proposal.user_id,
    caterer_id: proposal.caterer_id,
    status: proposal.status,
    event_type: proposal.event_type,
    location: proposal.location,
    dietary_preferences: proposal.dietary_preferences,
    budget_per_person: proposal.budget_per_person ? Number(proposal.budget_per_person) : null,
    event_date: proposal.event_date,
    vision: proposal.vision,
    guest_count: proposal.guest_count,
    user: {
      id: proposal.user.id,
      name: `${proposal.user.first_name} ${proposal.user.last_name}`,
      email: proposal.user.email,
      phone: proposal.user.phone,
    },
    caterer: {
      id: proposal.caterer.id,
      name: proposal.caterer.catererinfo?.business_name || `${proposal.caterer.first_name} ${proposal.caterer.last_name}`,
    },
    created_at: proposal.created_at,
    updated_at: proposal.updated_at,
  };
};

/**
 * Get all proposals for a user
 */
export const getProposals = async (userId: string) => {
  const proposals = await prisma.proposal.findMany({
    where: { user_id: userId },
    include: {
      caterer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          catererinfo: {
            select: {
              business_name: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return proposals.map((proposal) => ({
    id: proposal.id,
    user_id: proposal.user_id,
    caterer_id: proposal.caterer_id,
    status: proposal.status,
    event_type: proposal.event_type,
    location: proposal.location,
    dietary_preferences: proposal.dietary_preferences,
    budget_per_person: proposal.budget_per_person ? Number(proposal.budget_per_person) : null,
    event_date: proposal.event_date,
    vision: proposal.vision,
    guest_count: proposal.guest_count,
    caterer: {
      id: proposal.caterer.id,
      name: proposal.caterer.catererinfo?.business_name || `${proposal.caterer.first_name} ${proposal.caterer.last_name}`,
    },
    created_at: proposal.created_at,
    updated_at: proposal.updated_at,
  }));
};

/**
 * Get a single proposal by ID
 */
export const getProposalById = async (userId: string, proposalId: string) => {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      user_id: userId,
    },
    include: {
      caterer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          catererinfo: {
            select: {
              business_name: true,
            },
          },
        },
      },
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  return {
    id: proposal.id,
    user_id: proposal.user_id,
    caterer_id: proposal.caterer_id,
    status: proposal.status,
    event_type: proposal.event_type,
    location: proposal.location,
    dietary_preferences: proposal.dietary_preferences,
    budget_per_person: proposal.budget_per_person ? Number(proposal.budget_per_person) : null,
    event_date: proposal.event_date,
    vision: proposal.vision,
    guest_count: proposal.guest_count,
    caterer: {
      id: proposal.caterer.id,
      name: proposal.caterer.catererinfo?.business_name || `${proposal.caterer.first_name} ${proposal.caterer.last_name}`,
    },
    created_at: proposal.created_at,
    updated_at: proposal.updated_at,
  };
};

