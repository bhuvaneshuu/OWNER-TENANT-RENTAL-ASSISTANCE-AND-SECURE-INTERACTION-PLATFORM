import { useState, useEffect, useCallback, useRef } from "react";
import {
  getContractOwnerView,
  clearAlert,
  deleteContract,
} from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageLoading, AlertToast, ConfirmModal } from "../../components";
import { Button, CircularProgress } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  createNumberFormatter,
  dateFormatter,
} from "../../utils/valueFormatter";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import html2pdf from "html2pdf.js";

const ContractDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { realEstateId } = useParams();

  const {
    contractDetail,
    isLoading,
    isProcessing,
    alertFlag,
    alertType,
    alertMsg,
    success,
  } = useSelector((state) => state.ownerUser);

  const contractRef = useRef();

  useEffect(() => {
    dispatch(getContractOwnerView({ realEstateId }));
  }, [dispatch, realEstateId]);

  // Redirect to detail page of the property after contract is deleted
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${contractDetail?.realEstate?.slug}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, contractDetail?.realEstate?.slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const currentCountry = countries.find(
    (country) => country.label === contractDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  const handleDeleteContract = useCallback(() => {
    dispatch(deleteContract({ contractId: contractDetail?._id }));
    handleModalClose();
  }, [dispatch, contractDetail?._id, handleModalClose]);

  const handleDownload = () => {
    if (contractRef.current) {
      html2pdf().from(contractRef.current).set({
        margin: 0.5,
        filename: `Rental-Contract-${contractDetail?.realEstate?.title || ''}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  // calculate the total rent amount according to payment plan
  const calculateTotalRent = useCallback(() => {
    const { paymentPlan, rentAmount } = contractDetail;
    if (paymentPlan === "Monthly") return rentAmount;
    if (paymentPlan === "Every 2 Months") return rentAmount * 2;
    if (paymentPlan === "Every 3 Months") return rentAmount * 3;
    if (paymentPlan === "Every 6 Months") return rentAmount * 6;
    if (paymentPlan === "Every 12 Months") return rentAmount * 12;
  }, [contractDetail]);

  if (isLoading) return <PageLoading />;

  if (!contractDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Contract Does not Exists!</h1>
      </div>
    );

  return (
    <main className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-100 py-8">
      <div className="w-full max-w-2xl relative">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute right-0 top-0 bg-[#223981] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1a2a5c] transition-colors text-sm font-semibold z-10"
        >
          Download PDF
        </button>
        <div ref={contractRef} className="bg-white rounded-2xl shadow-2xl px-8 py-10 border border-slate-200 mt-10">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#223981', letterSpacing: 1 }}>Rental Agreement</h1>
            <p className="text-gray-500 text-sm">Digital Contract</p>
          </div>
          {/* Parties Section */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#223981' }}>Landlord</h2>
              <div className="mb-1 font-semibold">{contractDetail?.owner?.firstName} {contractDetail?.owner?.lastName}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <EmailRoundedIcon fontSize="small" /> {contractDetail?.owner?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LocalPhoneRoundedIcon fontSize="small" /> {contractDetail?.owner?.phoneNumber}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#223981' }}>Tenant</h2>
              <div className="mb-1 font-semibold">{contractDetail?.tenant?.firstName} {contractDetail?.tenant?.lastName}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><EmailRoundedIcon fontSize="small" /> {contractDetail?.tenant?.email}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><LocalPhoneRoundedIcon fontSize="small" /> {contractDetail?.tenant?.phoneNumber}</div>
            </div>
          </div>
          {/* Property & Contract Details */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3" style={{ color: '#223981' }}>Property & Contract Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Property:</span> {contractDetail?.realEstate?.title}</div>
              <div><span className="font-semibold">Category:</span> {contractDetail?.realEstate?.category}</div>
              <div className="col-span-2"><span className="font-semibold">Address:</span> {contractDetail?.realEstate?.address.streetName}, {contractDetail?.realEstate?.address.city}, {contractDetail?.realEstate?.address.state}, {contractDetail?.realEstate?.address?.country}</div>
              <div><span className="font-semibold">Start Date:</span> {dateFormatter(contractDetail?.startDate)}</div>
              <div><span className="font-semibold">Payment Plan:</span> {contractDetail?.paymentPlan}</div>
              <div><span className="font-semibold">Rent Amount:</span> {countryToCurrency[currentCountry.code]} {format(contractDetail?.rentAmount)} / month</div>
              <div><span className="font-semibold">Total Rent:</span> {countryToCurrency[currentCountry.code]} {format(calculateTotalRent())}</div>
            </div>
          </div>
          {/* Agreement Text */}
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#223981' }}>Agreement</h2>
            <div className="text-justify text-gray-700 leading-relaxed text-sm md:text-base">
              <p>This Rental Agreement Contract is applicable from <strong>{dateFormatter(contractDetail?.startDate)}</strong>, created by the property owner <strong>{contractDetail?.owner?.firstName} {contractDetail?.owner?.lastName}</strong>, for the rental of the property located at <strong>{contractDetail?.realEstate?.address?.location}, {contractDetail?.realEstate?.address?.streetName}</strong> with the tenant <strong>{contractDetail?.tenant?.firstName} {contractDetail?.tenant?.lastName}</strong>.</p>
              <br />
              <h5 className="font-semibold mt-2 mb-1">1. Payment of Rent</h5>
              <p>Tenant shall pay rent in the amount of <strong>{countryToCurrency[currentCountry.code]} {format(contractDetail?.rentAmount)}</strong> per month. Total Rent amount of <strong>{countryToCurrency[currentCountry.code]} {format(calculateTotalRent())}</strong> shall be due and payable <strong>{contractDetail?.paymentPlan}</strong> on the first day of the calendar month and shall be considered late if not received by the Landlord on or before the 7th day of the month.</p>
              <br />
              <h5 className="font-semibold mt-2 mb-1">2. Terms & Conditions</h5>
              <p>The Tenant agrees to abide by all terms and conditions set forth in this contract, including timely payment of rent, proper maintenance of the property, and adherence to all applicable laws and regulations. The Landlord reserves the right to terminate this agreement in case of breach of contract.</p>
            </div>
          </div>
          {/* Signature Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mt-10 gap-8">
            <div className="flex flex-col items-center md:items-start">
              {/* E-signature: Owner */}
              <span className="text-xl mb-1" style={{ fontFamily: 'cursive', color: '#223981' }}>{contractDetail?.owner?.firstName} {contractDetail?.owner?.lastName}</span>
              <div className="w-40 border-b-2 border-slate-300 mb-1" />
              <span className="text-xs text-gray-500">Landlord Signature</span>
            </div>
            <div className="flex flex-col items-center md:items-center">
              {/* Date with formatted contract creation date */}
              <span className="text-base mb-1" style={{ color: '#223981' }}>{dateFormatter(contractDetail?.createdAt)}</span>
              <div className="w-32 border-b-2 border-slate-300 mb-1" />
              <span className="text-xs text-gray-500">Date</span>
            </div>
            <div className="flex flex-col items-center md:items-end">
              {/* E-signature: Tenant */}
              <span className="text-xl mb-1" style={{ fontFamily: 'cursive', color: '#223981' }}>{contractDetail?.tenant?.firstName} {contractDetail?.tenant?.lastName}</span>
              <div className="w-40 border-b-2 border-slate-300 mb-1" />
              <span className="text-xs text-gray-500">Tenant Signature</span>
            </div>
          </div>
        </div>
      </div>
      {/* Terminate Button below the contract card */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleModalOpen}
          variant="contained"
          size="medium"
          color="error"
          sx={{ color: "#fff" }}
          disabled={isProcessing || (alertFlag && alertType === "success")}
          startIcon={<RemoveCircleRoundedIcon />}
        >
          {isProcessing ? (
            <CircularProgress size={26} sx={{ color: "#fff" }} />
          ) : (
            "Terminate Contract"
          )}
        </Button>
      </div>
      <AlertToast alertFlag={alertFlag} alertMsg={alertMsg} alertType={alertType} handleClose={handleAlertClose} />
      <ConfirmModal open={open} handleModalClose={handleModalClose}>
        <h3 className="text-center">Delete Contract?</h3>
        <p className="text-center my-4">Are you sure you want to delete this contract? This action cannot be undone.</p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="error">Close</Button>
          <Button onClick={handleDeleteContract} color="success" variant="contained">Delete</Button>
        </div>
      </ConfirmModal>
    </main>
  );
};

export default ContractDetailPage;