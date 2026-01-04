import { Request, Response, NextFunction } from "express";
import * as proposalService from "./proposal.services";

/**
 * Get all proposals for the authenticated caterer
 * GET /api/caterer/proposals
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

    const proposals = await proposalService.getProposalsForCaterer(user.userId);

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
 * Get a single proposal by ID for the authenticated caterer
 * GET /api/caterer/proposals/:proposalId
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

    const proposal = await proposalService.getProposalByIdForCaterer(user.userId, proposalId);

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

/**
 * Update proposal status
 * PUT /api/caterer/proposals/:proposalId/status
 */
export const updateProposalStatus = async (
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
    const { status } = req.body;

    if (!proposalId) {
      res.status(400).json({
        success: false,
        error: {
          message: "Proposal ID is required",
        },
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        error: {
          message: "Status is required",
        },
      });
      return;
    }

    const validStatuses = ["PENDING", "PROCESSING", "QUOTED", "ACCEPTED", "REJECTED", "CANCELLED", "EXPIRED"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: {
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
      });
      return;
    }

    const proposal = await proposalService.updateProposalStatus(user.userId, proposalId, { status });

    res.status(200).json({
      success: true,
      data: proposal,
      message: "Proposal status updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating proposal status:", error);
    const statusCode =
      error.message?.includes("not found") || error.message?.includes("required")
        ? 400
        : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message || "An error occurred while updating proposal status",
      },
    });
  }
};

