import prisma from "../../../lib/prisma";

/**
 * Get all proposals for a caterer
 */
export const getProposalsForCaterer = async (catererId: string) => {
  const proposals = await prisma.proposal.findMany({
    where: { caterer_id: catererId },
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
    user: {
      id: proposal.user.id,
      name: `${proposal.user.first_name} ${proposal.user.last_name}`,
      email: proposal.user.email,
      phone: proposal.user.phone,
    },
    created_at: proposal.created_at,
    updated_at: proposal.updated_at,
  }));
};

/**
 * Get a single proposal by ID for a caterer
 */
export const getProposalByIdForCaterer = async (catererId: string, proposalId: string) => {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      caterer_id: catererId,
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
    user: {
      id: proposal.user.id,
      name: `${proposal.user.first_name} ${proposal.user.last_name}`,
      email: proposal.user.email,
      phone: proposal.user.phone,
    },
    created_at: proposal.created_at,
    updated_at: proposal.updated_at,
  };
};

/**
 * Update proposal status
 */
export interface UpdateProposalStatusInput {
  status: "PENDING" | "PROCESSING" | "QUOTED" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "EXPIRED";
}

export const updateProposalStatus = async (
  catererId: string,
  proposalId: string,
  input: UpdateProposalStatusInput
) => {
  // Verify proposal belongs to caterer
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      caterer_id: catererId,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  // Update proposal status
  const updatedProposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: input.status,
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
    },
  });

  return {
    id: updatedProposal.id,
    user_id: updatedProposal.user_id,
    caterer_id: updatedProposal.caterer_id,
    status: updatedProposal.status,
    event_type: updatedProposal.event_type,
    location: updatedProposal.location,
    dietary_preferences: updatedProposal.dietary_preferences,
    budget_per_person: updatedProposal.budget_per_person ? Number(updatedProposal.budget_per_person) : null,
    event_date: updatedProposal.event_date,
    vision: updatedProposal.vision,
    guest_count: updatedProposal.guest_count,
    user: {
      id: updatedProposal.user.id,
      name: `${updatedProposal.user.first_name} ${updatedProposal.user.last_name}`,
      email: updatedProposal.user.email,
      phone: updatedProposal.user.phone,
    },
    created_at: updatedProposal.created_at,
    updated_at: updatedProposal.updated_at,
  };
};

