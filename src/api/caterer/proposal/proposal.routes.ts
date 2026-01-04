import { Router } from "express";
import * as proposalController from "./proposal.controller";
import { authenticate } from "../../auth/auth.middleware";

const router = Router();

// All proposal routes require authentication
router.use(authenticate);

/**
 * Get all proposals for the authenticated caterer
 * GET /api/caterer/proposals
 */
router.get("/", proposalController.getProposals);

/**
 * Get a single proposal by ID
 * GET /api/caterer/proposals/:proposalId
 */
router.get("/:proposalId", proposalController.getProposalById);

/**
 * Update proposal status
 * PUT /api/caterer/proposals/:proposalId/status
 * 
 * Request body:
 * {
 *   status: "PENDING" | "PROCESSING" | "QUOTED" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "EXPIRED"
 * }
 */
router.put("/:proposalId/status", proposalController.updateProposalStatus);

export default router;

