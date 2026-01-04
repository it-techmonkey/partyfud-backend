import { Router } from "express";
import * as proposalController from "./proposal.controller";
import { authenticate } from "../../auth/auth.middleware";

const router = Router();

// All proposal routes require authentication
router.use(authenticate);

/**
 * Get all proposals for the authenticated user
 * GET /api/user/proposals
 */
router.get("/", proposalController.getProposals);

/**
 * Get a single proposal by ID
 * GET /api/user/proposals/:proposalId
 */
router.get("/:proposalId", proposalController.getProposalById);

/**
 * Create a proposal
 * POST /api/user/proposals
 * 
 * Request body:
 * {
 *   caterer_id: string (required),
 *   event_type?: string,
 *   location?: string,
 *   dietary_preferences?: string[],
 *   budget_per_person?: number | string (e.g., "AED 12" or 12),
 *   event_date?: string (ISO date),
 *   vision?: string,
 *   guest_count: number (required)
 * }
 */
router.post("/", proposalController.createProposal);

export default router;

