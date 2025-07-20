import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleRentDetailOwnerView,
  sendPaymentEmailToTenant,
  clearAlert,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal, AlertToast } from "../../components";
import { Button, CircularProgress } from "@mui/material";
import {
  dateFormatter,
  format,
  calculateTotalRent,
  calculateNumberOfMonths,
  createNumberFormatter,
} from "../../utils/valueFormatter";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";

const SendPaymentEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rentDetailId } = useParams();

  const {
    isLoading,
    rentDetail,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    success,
  } = useSelector((state) => state.rentDetailOwner);

  const currentCountry = countries.find(
    (country) => country.label === rentDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);

  // Redirect to detail page of the property after successful contract creation
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

  const [formValues, setFormData] = useState({});

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: rentDetail?.tenant?.email,
      from: rentDetail?.owner?.email,
      subject: `${calculateNumberOfMonths(
        rentDetail?.paymentPlan
      )} rental payment of Property: ${rentDetail?.realEstate?.title}`,
      body: `
      <p>
      Dear ${rentDetail?.tenant?.firstName} ${rentDetail?.tenant?.lastName},</p>
              <p>
                I hope this email finds you well. This is a friendly reminder that your ${calculateNumberOfMonths(
                  rentDetail?.paymentPlan
                )} rent payment for the dates from ${dateFormatter(
        rentDetail?.currentRentDate.from
      )} to ${dateFormatter(
        rentDetail?.currentRentDate.to
      )} is due. As per our rental agreement, rent is to be paid within 7 days after ${dateFormatter(
        rentDetail?.currentRentDate.from
        )}. The total rent amount is ${countryToCurrency[currentCountry.code]} ${format(
        calculateTotalRent(
          rentDetail?.paymentPlan,
          rentDetail?.realEstate.price
        )
        )} for ${countryToCurrency[currentCountry.code]} ${format(rentDetail?.realEstate?.price)} per month.
              </p>
              <p>
                Please note that late payment fees may apply if the rent is not
                paid by the due date. If you have any questions or concerns,
                please do not hesitate to contact me. Thank you for your
                cooperation. Kindly contact me at ${rentDetail?.owner?.email} or
                +977 ${rentDetail?.owner?.phoneNumber}.
              </p>
              <p>
                Real Estate Title: <b>${rentDetail?.realEstate?.title}</b>
                <br />
                Number of Months: <b>${calculateNumberOfMonths(
                  rentDetail?.paymentPlan
                )}</b> <br />
                Rent Amount: <b>${countryToCurrency[currentCountry?.code]} ${format(rentDetail?.realEstate?.price)} per month.</b> <br />
                Rent Due Date: <b>${dateFormatter(
                  rentDetail?.currentRentDate.from
                )}</b>
                <br />
              </p>
              <p>Best regards,</p>
              <p>
                ${rentDetail?.owner?.firstName} ${rentDetail?.owner?.lastName}
              </p>
      `,
    };

    setFormData(emailTemplate);
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendPaymentEmailToTenant({ formValues }));
    handleModalClose();
  }, [dispatch, formValues, handleModalClose]);

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return <h1 className="mt-6 text-center">Rent Detail Not Found</h1>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-10 flex flex-col items-center justify-center animate-fadein-scale">
      <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col gap-6 animate-fadein-scale">
        {/* Hero Section */}
        <div className="flex items-center gap-3 mb-4">
          <ForwardToInboxRoundedIcon sx={{ color: '#223981', fontSize: 36 }} />
          <h4 className="font-heading font-extrabold text-2xl text-[#223981] tracking-wide drop-shadow-lg">Send Payment Email</h4>
        </div>
        <form onSubmit={handleSendConfirmation} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-[#223981]">To:</span>
              <span className="text-[#475569]">{rentDetail?.tenant?.email}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-[#223981]">From:</span>
              <span className="text-[#475569]">{rentDetail?.owner?.email}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-[#223981]">Subject:</span>
              <span className="text-[#475569]">
                {calculateNumberOfMonths(rentDetail?.paymentPlan)} rental payment of Property: <b>{rentDetail?.realEstate?.title}</b>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-[#223981]">Body:</span>
            <div className="text-sm mt-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
              <p>
                Dear {rentDetail?.tenant?.firstName} {rentDetail?.tenant?.lastName},
              </p>
              <br />
              <p>
                I hope this email finds you well. This is a friendly reminder that your {calculateNumberOfMonths(rentDetail?.paymentPlan)} rent payment for the dates from {dateFormatter(rentDetail?.currentRentDate.from)} to {dateFormatter(rentDetail?.currentRentDate.to)} is due. As per our rental agreement, rent is to be paid within 7 days after {dateFormatter(rentDetail?.currentRentDate.from)}. The total rent amount is {countryToCurrency[currentCountry.code]} {format(calculateTotalRent(rentDetail?.paymentPlan, rentDetail?.realEstate.price))} for {countryToCurrency[currentCountry.code]} {format(rentDetail?.realEstate?.price)} per month.
              </p>
              <br />
              <p>
                Please note that late payment fees may apply if the rent is not paid by the due date. If you have any questions or concerns, please do not hesitate to contact me. Thank you for your cooperation. Kindly contact me at {rentDetail?.owner?.email} or +977 {rentDetail?.owner?.phoneNumber}.
              </p>
              <br />
              <p>
                Real Estate Title: <b>{rentDetail?.realEstate?.title}</b><br />
                Number of Months: <b>{calculateNumberOfMonths(rentDetail?.paymentPlan)}</b> <br />
                Rent Amount: <b>{countryToCurrency[currentCountry.code]} {format(calculateTotalRent(rentDetail?.paymentPlan, rentDetail?.realEstate.price))}</b> <br />
                Rent Due Date: <b>{dateFormatter(rentDetail?.currentRentDate.from)}</b> <br />
                <br />
              </p>
              <p>Best regards,</p>
              <p>{rentDetail?.owner?.firstName} {rentDetail?.owner?.lastName}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              disabled={isProcessing}
              type="submit"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(90deg, #223981 0%, #3b82f6 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                py: 1.5,
                px: 6,
                borderRadius: 2,
                letterSpacing: 1,
                boxShadow: 3,
                textTransform: 'uppercase',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1a2a5c 0%, #2563eb 100%)',
                  boxShadow: 6,
                },
              }}
              startIcon={<SendRoundedIcon />}
            >
              {isProcessing ? (
                <CircularProgress size={26} sx={{ color: "#fff" }} />
              ) : (
                "Send Email"
              )}
            </Button>
          </div>
        </form>
      </div>
      <AlertToast alertFlag={alertFlag} alertMsg={alertMsg} alertType={alertType} handleClose={handleAlertClose} />
      <ConfirmModal open={open} handleModalClose={handleModalClose}>
        <h3 className="text-center">Confirm Send Email?</h3>
        <p className="text-center my-4">Are you sure you want to send this payment reminder email to the tenant?</p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="error">Close</Button>
          <Button onClick={handleEmailSend} color="success" variant="contained">Send</Button>
        </div>
      </ConfirmModal>
    </main>
  );
};

export default SendPaymentEmailPage;
