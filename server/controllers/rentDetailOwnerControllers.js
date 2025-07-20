import mongoose from "mongoose";
import TenantUser from "../models/TenantUser.js";
import RealEstate from "../models/RealEstate.js";
import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import moment from "moment";

/**
 * @description Create Contract
 * @route POST /api/rentDetail/createDetail
 * @returns {object} rent detail object
 */
const createRentDetail = async (req, res) => {
  const {
    tenant,
    realEstate,
    startDate,
    endDate, // optional from frontend
    monthlyRent,
    paymentPlan,
    contractTerms,
    status,
  } = req.body;

  // Inject owner
  req.body.owner = req.user.userId;

  // 🛠 Calculate endDate if not given (1 year from startDate)
  const computedEndDate = endDate || moment(startDate).add(1, 'year').format('YYYY-MM-DD');

  // ✅ Set currentRentDate
  req.body.currentRentDate = {
    from: startDate,
    to: computedEndDate,
  };

  // ✅ Field validation
  if (
    !tenant ||
    !realEstate ||
    !startDate ||
    !req.body.currentRentDate?.to ||
    !monthlyRent ||
    !paymentPlan
  ) {
    return res.status(400).json({
      msg: "Please provide all required fields: tenant, realEstate, startDate, monthlyRent, and paymentPlan",
    });
  }

  // ✅ Date logic
  if (new Date(startDate) >= new Date(req.body.currentRentDate.to)) {
    return res.status(400).json({
      msg: "Start date must be before end date",
    });
  }

  // ✅ Check if rent detail exists
  const rentDetailExists = await RentDetail.findOne({
    owner: req.user.userId,
    tenant,
    realEstate,
  });
  if (rentDetailExists) {
    return res.status(400).json({ msg: "Rent detail already exists" });
  }

  const rentDetailExistsForRealEstate = await RentDetail.findOne({ realEstate });
  if (rentDetailExistsForRealEstate) {
    return res.status(400).json({ msg: "Rent Detail already exists for this real estate" });
  }

  // ✅ Validate tenant & property
  const tenantUser = await TenantUser.findById(tenant);
  if (!tenantUser) {
    return res.status(404).json({ msg: "Tenant user not found" });
  }

  const realEstateUser = await RealEstate.findById(realEstate);
  if (!realEstateUser) {
    return res.status(404).json({ msg: "Real estate not found" });
  }

  // ✅ Create
  const rentDetail = await RentDetail.create(req.body);

  res.status(201).json({
    rentDetail,
    msg: "Rent detail created",
    success: true,
  });
};

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 * @returns {object} Rent Details Array
 */
const getAllRentDetailsOwnerView = async (req, res) => {
  const rentDetails = await RentDetail.find({ owner: req.user.userId })
    .populate({
      path: "realEstate",
      select: "_id title price address category realEstateImages slug",
    })
    .populate({
      path: "tenant",
      select: "_id firstName lastName address profileImage slug email",
    })
    .populate({
      path: "owner",
      select: "_id firstName lastName address profileImage slug email",
    })
    .sort({ createdAt: -1 });

  res.json({ rentDetails, count: rentDetails.length });
};

/**
 * @description Get single Rent Detail for owner user
 * @route GET /api/rentDetail/:rentDetailId
 * @returns {object} Single Rent Detail Object
 */
const getSingleRentDetailOwnerView = async (req, res) => {
  const rentDetail = await RentDetail.findById(req.params.rentDetailId)
    .populate({
      path: "realEstate",
      select: "_id title price address category realEstateImages slug",
    })
    .populate({
      path: "tenant",
      select: "_id firstName lastName profileImage slug email phoneNumber",
    })
    .populate({
      path: "owner",
      select: "_id slug email phoneNumber firstName lastName",
    });

  if (!rentDetail) {
    throw new NotFoundError("Rent detail not found");
  }

  const rentStatus = await rentDetail.isRentPaid();

  res.json({ rentDetail, rentStatus });
};

/**
 * @description Create rent payment history
 * @route POST /api/rentDetail/createPaymentHistory
 * @returns {object} Payment Detail Object
 */
const createPaymentHistory = async (req, res) => {
  const { rentDetail } = req.body;

  const checkRentDetail = await RentDetail.findById(rentDetail);
  if (!checkRentDetail) {
    throw new NotFoundError("Rent detail not found");
  }

  const rentStatus = await checkRentDetail.isRentPaid();
  if (rentStatus) {
    throw new BadRequestError("Rent payment for this month is already registered.");
  }

  const { currentRentDate, amountPaid, paymentMethod, nextRentDueDate } = req.body;

  const paymentDetail = await PaymentHistory.create({
    rentDetail,
    currentRentDate,
    amountPaid,
    paymentMethod,
  });

  checkRentDetail.currentRentDate = nextRentDueDate;
  await checkRentDetail.save();

  res.status(201).json({ paymentDetail, msg: "Payment detail created" });
};

/**
 * @description Get All Payment History for a rent detail (paginated)
 * @route GET /api/rentDetail/allPaymentHistory/:rentDetailId
 * @returns {object} All Payment History Array
 */
const getAllPaymentHistory = async (req, res) => {
  let paymentHistoryResults = PaymentHistory.find({
    rentDetail: req.params.rentDetailId,
  }).sort({ createdAt: -1 });

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  paymentHistoryResults = paymentHistoryResults.skip(skip).limit(limit);
  const allPaymentHistory = await paymentHistoryResults;

  const totalPaymentHistory = await PaymentHistory.countDocuments({
    rentDetail: req.params.rentDetailId,
  });

  const numberOfPages = Math.ceil(totalPaymentHistory / limit);

  res.json({ allPaymentHistory, numberOfPages, totalPaymentHistory });
};

// ✅ Export matching names
export {
  createRentDetail,
  getAllRentDetailsOwnerView,
  getSingleRentDetailOwnerView,
  createPaymentHistory,
  getAllPaymentHistory,
};