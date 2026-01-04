import { Request, Response, NextFunction } from "express";
import * as proposalService from "./proposal.services";

/**
 * Create a proposal
 * POST /api/user/proposals
 */
export const createProposal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const {
      caterer_id,
      event_type,
      location,
      dietary_preferences,
      budget_per_person,
      event_date,
      vision,
      guest_count,
    } = req.body;

    // Validate required fields
    if (!caterer_id) {
      res.status(400).json({
        success: false,
        error: {
          message: "Caterer ID is required",
        },
      });
      return;
    }

    if (!guest_count || guest_count <= 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "Guest count is required and must be greater than 0",
        },
      });
      return;
    }

    // Parse budget_per_person if it's a string (e.g., "AED 12" -> 12)
    let parsedBudget = budget_per_person;
    if (typeof budget_per_person === 'string') {
      // Extract number from string like "AED 12" or "12"
      const match = budget_per_person.match(/(\d+(?:\.\d+)?)/);
      parsedBudget = match ? parseFloat(match[1]) : undefined;
    }

    const proposal = await proposalService.createProposal(user.userId, {
      caterer_id,
      event_type,
      location,
      dietary_preferences: Array.isArray(dietary_preferences) ? dietary_preferences : undefined,
      budget_per_person: parsedBudget,
      event_date,
      vision,
      guest_count: Number(guest_count),
    });

    res.status(201).json({
      success: true,
      data: proposal,
      message: "Proposal created successfully",
    });
  } catch (error: any) {
    console.error("Error creating proposal:", error);
    const statusCode =
      error.message?.includes("not found") ||
      error.message?.includes("not approved") ||
      error.message?.includes("required")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while creating proposal",
      },
    });
  }
};

/**
 * Get all proposals for the authenticated user
 * GET /api/user/proposals
 */
export const getProposals = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const proposals = await proposalService.getProposals(user.userId);

    res.status(200).json({
      success: true,
      data: proposals,
      count: proposals.length,
    });
  } catch (error: any) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching proposals",
      },
    });
  }
};

/**
 * Get a single proposal by ID
 * GET /api/user/proposals/:proposalId
 */
export const getProposalById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
      return;
    }

    const proposalId = req.params.proposalId;
    if (!proposalId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Proposal ID is required",
        },
      });
      return;
    }

    const proposal = await proposalService.getProposalById(user.userId, proposalId);

    res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error: any) {
    console.error("Error fetching proposal:", error);
    const statusCode = error.message?.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while fetching proposal",
      },
    });
  }
};

