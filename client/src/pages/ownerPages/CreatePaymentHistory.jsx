import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import {
  getSingleRentDetailOwnerView,
  createPaymentHistory,
  clearAlert,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { AlertToast, ConfirmModal, PageLoading } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import {
  dateFormatter,
  calculateTotalRent,
  calculateNumberOfMonths,
  calculateNextDueDate,
  calculateAddedDate,
  createNumberFormatter,
} from "../../utils/valueFormatter";
import paymentImg from "../../assets/images/payment.svg";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";

const CreatePaymentHistory = () => {
  const { rentDetailId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    rentDetail,
    success,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    isLoading,
  } = useSelector((state) => state.rentDetailOwner);

  const currentCountry = countries.find(
    (country) => country.label === rentDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);

  const paymentMethodOptions = ["Cash", "Cheque", "Bank Transfer", "Online"];

  // Set today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().slice(0, 10);
  const [paymentForm, setPaymentFrom] = useState({
    paymentMethod: "",
    paymentDate: todayStr
  });

  // handle change in the form
  const handleChange = useCallback(
    (e) => {
      setPaymentFrom({ ...paymentForm, [e.target.name]: e.target.value });
    },
    [paymentForm]
  );

  // Redirect to all rent details page
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(
          `/owner/rentDetail/${rentDetailId}/${rentDetail?.realEstate.slug}`
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, rentDetailId, rentDetail?.realEstate.slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal state and handlers
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();
    const { paymentMethod, paymentDate } = paymentForm;
    const nextDueDate = calculateNextDueDate(rentDetail?.currentRentDate?.to);
    setFormData({
      paymentMethod,
      paymentDate,
      rentDetail: rentDetailId,
      amountPaid: calculateTotalRent(
        rentDetail?.paymentPlan,
        rentDetail?.realEstate?.price
      ),
      currentRentDate: {
        from: rentDetail?.currentRentDate?.from,
        to: rentDetail?.currentRentDate?.to,
      },
      nextRentDueDate: {
        from: nextDueDate,
        to: calculateAddedDate(rentDetail?.paymentPlan, nextDueDate),
      },
    });
    handleModalOpen();
  };

  const handleCreateRentDetail = useCallback(() => {
    dispatch(createPaymentHistory({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return <h1 className="mt-6 text-center">Rent Detail Not Found</h1>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-white py-10 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full mx-auto flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Payment Illustration (left) */}
        <div className="hidden md:block flex-1 self-center">
          <img src={paymentImg} alt="Payment Illustration" className="max-w-xs rounded-2xl shadow-lg" />
        </div>
        {/* Payment Form Card (right) */}
        <div className="relative w-full max-w-xl flex flex-col gap-6 group transition-transform duration-300 hover:scale-[1.025]">
          {/* Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 animate-gradient-x" />
          <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl border border-indigo-100 p-10 pt-8 flex flex-col gap-8 relative z-10">
            <div className="mb-2 text-center">
              <h2 className="font-heading font-extrabold text-3xl text-[#223981] mb-2 tracking-wide drop-shadow-lg">Register Payment</h2>
              <p className="text-gray-500 font-robotoNormal mb-2 text-base">Fill in the form below to log the payment detail</p>
              <h4 className="font-robotoNormal mt-2 text-lg text-[#223981] flex items-center justify-center gap-2">
                <HomeWorkRoundedIcon /> {rentDetail?.realEstate.title}
              </h4>
            </div>
            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-indigo-200">
              <div className="flex flex-col gap-1">
                <span className="text-blue-900 font-bold flex items-center gap-2 text-lg">
                  <DateRangeRoundedIcon sx={{ color: '#223981' }} />
                  {dateFormatter(rentDetail?.currentRentDate.from)} - {dateFormatter(rentDetail?.currentRentDate.to)}
                </span>
                <span className="text-indigo-700 font-bold flex items-center gap-2 text-lg">
                  {countryToCurrency[currentCountry.code]} {format(calculateTotalRent(rentDetail?.paymentPlan, rentDetail?.realEstate.price))}
                  <span className="text-gray-400 font-normal text-base">/ {calculateNumberOfMonths(rentDetail?.paymentPlan)} month(s)</span>
                </span>
              </div>
            </div>
            {/* Payment Form */}
            <form id="form" onSubmit={handleConfirmation} className="flex flex-col gap-8 mt-2">
              <div className="flex flex-col gap-6">
                <div>
                  <h5 className="text-[#223981] mb-2 flex items-center gap-2 text-base font-semibold">
                    <InfoRoundedIcon /> Select Payment Method
                  </h5>
                  <TextField
                    select
                    required
                    label="Payment Method"
                    value={paymentForm.paymentMethod}
                    onChange={handleChange}
                    sx={{ width: "100%", background: '#f8fafc', borderRadius: 2 }}
                    name="paymentMethod"
                    color="primary"
                  >
                    {paymentMethodOptions?.map((value, index) => (
                      <MenuItem key={index} value={value} className="">
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div>
                  <h5 className="text-[#223981] mb-2 flex items-center gap-2 text-base font-semibold">
                    Payment Date
                  </h5>
                  <input
                    type="date"
                    name="paymentDate"
                    value={paymentForm.paymentDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded border border-indigo-200 bg-[#f8fafc] text-[#223981] focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <Button
                  disabled={isProcessing || (alertFlag && alertType === "success")}
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(90deg, #223981 0%, #3b82f6 100%)',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    py: 2,
                    borderRadius: 3,
                    boxShadow: 6,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1a2a5c 0%, #2563eb 100%)',
                      boxShadow: 12,
                      transform: 'scale(1.04)',
                    },
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress size={28} sx={{ color: "#fff" }} />
                  ) : (
                    "Save Payment"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Confirm Modal and Toast */}
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center text-lg font-bold">Approve Payment</h3>
          <p className="text-center my-4 text-gray-600">
            Are you sure you want to approve this payment? This action cannot be undone.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="error">
              Close
            </Button>
            <Button
              onClick={handleCreateRentDetail}
              color="success"
              variant="contained"
            >
              Confirm
            </Button>
          </div>
        </ConfirmModal>
        <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleAlertClose}
        />
      </div>
    </main>
  );
};

export default CreatePaymentHistory;
