import TenantUser from "../models/TenantUser.js";
import OwnerUser from "../models/OwnerUser.js";
import RealEstate from "../models/RealEstate.js";
import Contract from "../models/Contract.js";
import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import { sendEmail } from "../utils/emailSender.js";
import mongoose from "mongoose";

/**
 * @description Create Contract
 * @route PATCH /api/owner/contract
 * @returns {object} Contract object
 */
const createContract = async (req, res) => {
  const { tenant, realEstate } = req.body;
  req.body.owner = req.user.userId;

  const contractExists = await Contract.findOne({
    owner: req.user.userId,
    tenant,
    realEstate,
  });
  if (contractExists) {
    throw new BadRequestError("Contract already exists");
  }

  const contractForRealEstate = await Contract.findOne({
    realEstate,
  });
  if (contractForRealEstate) {
    throw new BadRequestError("Contract already exists for this real estate");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);
  const tenantUser = await TenantUser.findById(tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const realEstateUser = await RealEstate.findById(realEstate);
  if (!realEstateUser) {
    throw new NotFoundError("Real estate not found");
  }

  const contract = await Contract.create({
    ...req.body,
    status: "Pending",
  });

  const to = tenantUser.email;
  const from = ownerUser.email;
  const subject = `Contract created for rental of property titled ${realEstateUser.title}`;
  const body = `
    <p> Dear ${tenantUser.firstName} ${tenantUser.lastName},</p>    
    <p>I hope this email finds you well. I am writing to inform about that the contract for rental of property titled <strong>${realEstateUser.title}</strong> located at ${realEstateUser.address.location}, ${realEstateUser.address.streetName} has been created successfully.</p>
    <p>Please follow the link to view and approve this contract. Please carefully review the rental contract and let us know if you have any questions or concerns.</p>
    <a href="${process.env.CLIENT_URL}/#/tenant/contract-agreement/${contract._id}"><strong>View Contract</strong></a><br>
    <p>Please note that the rental contract is legally binding, and both parties are required to adhere to its terms and conditions.</p>
    <p>If you have any questions or concerns about the rental contract or the rental process, please do not hesitate to contact me.</p>
   <br><br>
    <p>Best regards,</p>
    <p>${ownerUser.firstName} ${ownerUser.lastName}</p>`;

  await sendEmail(to, from, subject, body);

  realEstateUser.status = false;
  await realEstateUser.save();

  res.json({ contract });
};

/**
 * @description Get contract details for tenant user
 * @route GET /api/contract/tenantView/:contractId
 */
const getContractDetailTenantView = async (req, res) => {
  const contractDetail = await Contract.findOne({
    _id: req.params.contractId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title address category slug",
    })
    .populate({
      path: "owner",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "tenant",
      select: "firstName lastName email phoneNumber",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Approve contract
 * @route PATCH /api/contract/approve/:contractId
 */
const approveContract = async (req, res) => {
  const contractDetail = await Contract.findOne({
    _id: req.params.contractId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title address",
    })
    .populate({
      path: "owner",
      select: "firstName lastName email",
    })
    .populate({
      path: "tenant",
      select: "firstName lastName email address",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  const to = contractDetail.owner.email;
  const from = contractDetail.tenant.email;
  const subject = `Contract approved for rental of property titled ${contractDetail.realEstate.title}`;
  const body = `
    <p> Dear ${contractDetail.owner.firstName} ${contractDetail.owner.lastName},</p> 
    <p>Thank you for your email informing me that the rental contract has been created for the property titled <strong>${contractDetail.realEstate.title}</strong> at ${contractDetail.realEstate.address.location}, ${contractDetail.realEstate.address.streetName}. 
    I have carefully reviewed the terms and conditions outlined in the rental agreement and I am pleased to inform you that I agree to the terms and conditions.</p>
    <p>I appreciate the effort you have put into creating a rental agreement that protects the interests of both parties. I look forward to a positive and mutually beneficial relationship with you as my landlord.</p>
    <p>Thank you for your assistance.</p>
    <br><br>
    <p>Best Regards,</p>
    <p>${contractDetail.tenant.firstName} ${contractDetail.tenant.lastName}</p>`;

  await sendEmail(to, from, subject, body);

  contractDetail.status = "Active";
  await contractDetail.save();

  res.json({ contractDetail });
};

/**
 * @description Get contract details for owner user
 * @route GET /api/contract/ownerView/:realEstateId
 */
const getContractDetailOwnerView = async (req, res) => {
  const contractDetail = await Contract.findOne({
    owner: req.user.userId,
    realEstate: req.params.realEstateId,
  })
    .populate({
      path: "realEstate",
      select: "title address category slug",
    })
    .populate({
      path: "tenant",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "owner",
      select: "firstName lastName email phoneNumber",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Delete contract
 * @route DELETE /api/contract/delete/:contractId
 */
const deleteContract = async (req, res) => {
  const contract = await Contract.findOneAndDelete({
    _id: req.params.contractId,
    owner: req.user.userId,
  });

  if (!contract) {
    throw new NotFoundError("Contract not found");
  }

  const realEstate = await RealEstate.findById(contract.realEstate);
  if (!realEstate) {
    throw new NotFoundError("Real Estate Not Found");
  }

  realEstate.status = true;
  await realEstate.save();

  const rentDetail = await RentDetail.findOneAndDelete({
    realEstate: contract.realEstate,
    tenant: contract.tenant,
    owner: contract.owner,
  });

  if (rentDetail) {
    await PaymentHistory.deleteMany({
      rentDetail: rentDetail._id,
    });
  }

  const tenantUser = await TenantUser.findById(contract.tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  const to = tenantUser.email;
  const from = ownerUser.email;
  const subject = `Contract terminated of property titled ${realEstate.title}`;
  const body = `
    <p> Dear ${tenantUser.firstName} ${tenantUser.lastName},</p>    
    <p>I hope this email finds you well. I am writing to inform you about the termination of the rental contract of property titled <strong>${realEstate.title}</strong> 
    located at ${realEstate.address.location}, ${realEstate.address.streetName}</p>
    <p>The contract was terminated successfully along with the rent details and payment histories associated with it.</p>
    <p>Please note that you are required to vacate the property within 7 days. 
    We will conduct a final inspection of the property to ensure that it is in the same condition as when you moved in, 
    with reasonable wear and tear accepted. 
    Any damages or outstanding rent payments will be deducted from your security deposit.</p>
   <p>Thank you for your cooperation during your stay at our property.</p>
    <br><br>
    <p>Best regards,</p>
    <p>${ownerUser.firstName} ${ownerUser.lastName}</p>`;

  await sendEmail(to, from, subject, body);

  res.json({ message: "Contract terminated successfully", success: true });
};

/**
 * @description Get All Owner's Contracts
 * @route GET /api/contract/owner/allContracts
 */
const getOwnerAllContracts = async (req, res) => {
  const allContracts = await Contract.find({
    owner: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title _id",
    })
    .populate({
      path: "tenant",
      select: "_id firstName lastName",
    });
    
  res.json({ allContracts });
};

/**
 * @description Get the active rental properties of the tenant user
 * @route GET /api/contract/tenantUser/allRentalProperties
 */
const getAllTenantRentalProperties = async (req, res) => {
  const allRentalProperties = await Contract.find({
    tenant: mongoose.Types.ObjectId(req.user.userId),
  }).populate({
    path: "realEstate",
    select: "title address category slug realEstateImages price",
    populate: {
      path: "propertyOwner",
      model: "OwnerUser",
      select: "-createdAt -updatedAt -__v -contacts",
    },
  });

  res.json({ allRentalProperties, count: allRentalProperties.length });
};

/**
 * @description Get the contract details for the tenant user using the real estate id
 * @route GET /api/contract/tenant/:realEstateId
 */
const getTenantContractDetail = async (req, res) => {
  const contractDetail = await Contract.findOne({
    realEstate: mongoose.Types.ObjectId(req.params.realEstateId),
    tenant: mongoose.Types.ObjectId(req.user.userId),
    // status: "Active", // if you want to filter by status
  })
    .populate({
      path: "realEstate",
      select: "title address category slug",
    })
    .populate({
      path: "owner",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "tenant",
      select: "firstName lastName",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Get contracts without rent detail for owner
 * @route GET /api/contract/owner/contracts-without-rent
 */
const getOwnerContractsWithoutRentDetails = async (req, res) => {
  const contractsWithoutRentDetails = await Contract.find({
    owner: req.user.userId,
  })
  .populate({
    path: "realEstate",
    select: "title _id",
  })
  .populate({
    path: "tenant",
    select: "_id firstName lastName",
  });

  res.json({ contractsWithoutRentDetails });
};

export {
  createContract,
  getContractDetailTenantView,
  approveContract,
  getContractDetailOwnerView,
  deleteContract,
  getOwnerAllContracts,
  getAllTenantRentalProperties,
  getTenantContractDetail,
  getOwnerContractsWithoutRentDetails,
};

