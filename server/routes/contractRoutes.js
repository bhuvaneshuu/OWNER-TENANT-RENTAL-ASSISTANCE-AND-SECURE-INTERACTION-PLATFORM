import express from "express";
const router = express.Router();

import {
  createContract,
  getContractDetailTenantView,
  approveContract,
  getContractDetailOwnerView,
  deleteContract,
  getOwnerAllContracts,
  getAllTenantRentalProperties,
  getTenantContractDetail,
  getOwnerContractsWithoutRentDetails, // ✅ newly added import
} from "../controllers/contractControllers.js";

import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

/**
 * @description Create a contract
 * @route POST /api/contract
 */
router.post("/", authorizeOwnerUser, createContract);

/**
 * @description Get the contract details for the tenant user
 * @route GET /api/contract/tenantView/:contractId
 */
router.get(
  "/tenantView/:contractId",
  authorizeTenantUser,
  getContractDetailTenantView
);

/**
 * @description Approve the contract
 * @route PATCH /api/contract/approve/:contractId
 */
router.patch("/approve/:contractId", authorizeTenantUser, approveContract);

/**
 * @description Get the contract details for the owner user
 * @route GET /api/contract/ownerView/:realEstateId
 */
router.get(
  "/ownerView/:realEstateId",
  authorizeOwnerUser,
  getContractDetailOwnerView
);

/**
 * @description Delete a contract
 * @route DELETE /api/contract/delete/:contractId
 */
router.delete("/delete/:contractId", authorizeOwnerUser, deleteContract);

/**
 * @description Get All Owner's Contracts
 * @route GET /api/contract/owner/allContracts
 */
router.get("/owner/allContracts", authorizeOwnerUser, getOwnerAllContracts);

/**
 * @description Get the active rental properties of the tenant user
 * @route GET /api/contract/tenantUser/allRentalProperties
 */
router.get(
  "/tenantUser/allRentalProperties",
  authorizeTenantUser,
  getAllTenantRentalProperties
);

/**
 * @description Get the contract details for the tenant user using the real estate id
 * @route GET /api/contract/tenant/:realEstateId
 */
router.get(
  "/tenant/:realEstateId",
  authorizeTenantUser,
  getTenantContractDetail
);

/**
 * @description Get owner's contracts without rent details (for dropdown in rent details form)
 * @route GET /api/contract/owner/contracts-without-rent
 */
router.get(
  "/owner/contracts-without-rent",
  authorizeOwnerUser,
  getOwnerContractsWithoutRentDetails
);

export default router;

