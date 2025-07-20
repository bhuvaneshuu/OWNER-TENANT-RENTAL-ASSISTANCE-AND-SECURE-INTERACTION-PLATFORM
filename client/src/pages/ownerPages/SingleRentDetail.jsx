import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSingleRentDetailOwnerView,
  getAllPaymentHistory,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  PageLoading,
  Footer,
  ImageCarousal,
  PaymentHistoryComponent,
} from "../../components";
import { CardActionArea, Avatar, Button, Typography, Divider, Chip } from "@mui/material";
import {
  dateFormatter,
  calculateNextDueDate,
  createNumberFormatter,
} from "../../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import moment from "moment";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import countryToCurrency from "country-to-currency";
import { countries } from "../../utils/countryList";

const SingleRentDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rentDetailId } = useParams();
  const ref = useRef(null);
  const {
    isLoading,
    rentDetail,
    isRentPaid,
    allPaymentHistory,
    isProcessing,
    numberOfPages,
  } = useSelector((state) => state.rentDetailOwner);
  const [page, setPage] = useState(1);
  const currentCountry = countries.find(
    (country) => country.label === rentDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);
  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(getAllPaymentHistory({ page: value, rentDetailId }));
  };
  const handleShowPayment = () => {
    dispatch(getAllPaymentHistory({ rentDetailId, page: 1 }));
    setShowPaymentHistory(true);
    setPage(1);
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h4" sx={{ color: '#223981', fontWeight: 700, mb: 2 }}>
            Rent Detail Not Found
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{ color: '#223981', borderColor: '#223981' }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: '#223981',
                borderColor: '#223981',
                '&:hover': { borderColor: '#1a2a5c', backgroundColor: 'rgba(34,57,129,0.04)' },
                fontWeight: 600,
                fontSize: '1rem',
                px: 3,
                py: 1.2,
                borderRadius: 2
              }}
            >
              Back to Rent Details
            </Button>
            <Typography variant="h3" sx={{ color: '#223981', fontWeight: 800, mb: 0 }}>
              Rent Detail
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Property Image and Register Payment */}
            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[420px] max-h-[600px] min-w-[380px] max-w-[700px] flex items-center justify-center mx-auto">
                <ImageCarousal realEstateImages={rentDetail?.realEstate?.realEstateImages} />
              </div>
              {/* Payment Actions Section (moved left) */}
              <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-indigo-100 w-full min-h-[160px] max-w-[520px] mx-auto">
                <Typography
                  variant="h6"
                  sx={{
                    color: '#223981',
                    fontWeight: 700,
                    letterSpacing: 1,
                    mb: 2,
                    textTransform: 'uppercase',
                    fontSize: '1.1rem'
                  }}
                >
                  Payment Actions
                </Typography>
                <div className="w-full mb-4">
                  <hr className="border-t border-indigo-200" />
                </div>
                {isRentPaid && (
                  <div className="w-full mb-4">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded flex items-center">
                      <PointOfSaleIcon sx={{ color: '#f59e42', mr: 1, fontSize: 22 }} />
                      <span style={{ fontSize: '1rem' }}>
                        Rent is already marked as paid for this period.<br />
                        Registering another payment will create a duplicate.
                      </span>
                    </div>
                  </div>
                )}
                {/* Send Payment Email Button */}
                <Button
                  component={Link}
                  to={`/owner/rentDetail/send-payment-email/${rentDetail?._id}`}
                  variant="outlined"
                  fullWidth
                  startIcon={<MailOutlineIcon sx={{ fontSize: 22 }} />}
                  sx={{
                    color: '#223981',
                    borderColor: '#223981',
                    mb: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    '&:hover': {
                      borderColor: '#1a2a5c',
                      backgroundColor: 'rgba(34,57,129,0.04)'
                    },
                  }}
                >
                  Send Payment Email
                </Button>
                <Link
                  to={`/owner/rentDetail/paymentHistory/${rentDetail?._id}/create`}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PointOfSaleIcon sx={{ fontSize: 22 }} />}
                    sx={{
                      background: 'linear-gradient(90deg, #223981 0%, #3b82f6 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      py: 1.7,
                      borderRadius: 3,
                      boxShadow: 3,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1a2a5c 0%, #2563eb 100%)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    Register Payment
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right: Combined Info/Contact */}
            <div className="flex flex-col gap-8">
              {/* Combined Property Info and Tenant Info Card */}
              <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 min-h-[380px] max-w-[520px] mx-auto w-full flex flex-col gap-8">
                {/* Property Info Section */}
                <div>
                  <Link to={`/owner/real-estate/${rentDetail?.realEstate?.slug}`}>
                    <Typography variant="h5" sx={{ color: '#223981', fontWeight: 700, mb: 2, cursor: 'pointer', '&:hover': { color: '#1a2a5c' }, fontSize: '1.5rem' }}>
                      {rentDetail?.realEstate?.title}
                    </Typography>
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <LocationOnOutlinedIcon sx={{ color: '#223981', fontSize: 22 }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>
                      {rentDetail?.realEstate?.address?.streetName}, {rentDetail?.realEstate?.address?.city}, {rentDetail?.realEstate?.address?.state}, {rentDetail?.realEstate?.address?.country}
                    </Typography>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4">
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontSize: '1rem' }}>
                      Rent per month
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#223981', fontWeight: 800, fontSize: '2rem' }}>
                      {countryToCurrency[currentCountry?.code]} {format(rentDetail?.realEstate?.price)}
                    </Typography>
                  </div>
                  <Divider sx={{ my: 3 }} />
                  {/* Rent Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>Payment Plan:</Typography>
                      <Typography variant="body2" sx={{ color: '#223981', fontWeight: 600, fontSize: '1rem' }}>{rentDetail?.paymentPlan}</Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>Current Rent Date:</Typography>
                      <Typography variant="body2" sx={{ color: '#223981', fontWeight: 600, fontSize: '1rem' }}>
                        {moment(rentDetail?.currentRentDate.from).format("MMM Do")} - {dateFormatter(rentDetail?.currentRentDate.to)}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>Next Rent Due:</Typography>
                      <Typography variant="body2" sx={{ color: '#223981', fontWeight: 600, fontSize: '1rem' }}>
                        {dateFormatter(calculateNextDueDate(rentDetail?.currentRentDate.to))}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>Rent Status:</Typography>
                      <Chip
                        icon={isRentPaid ? <DoneRoundedIcon /> : <CloseRoundedIcon />}
                        label={isRentPaid ? "Paid" : "Unpaid"}
                        color={isRentPaid ? "success" : "error"}
                        sx={{ fontWeight: 600, fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>
                {/* Tenant Info Section */}
                <div className="flex flex-col items-center gap-4">
                  <Link to={`/owner/tenant-user/${rentDetail?.tenant?.slug}`} style={{ textDecoration: 'none', width: '100%' }}>
                    <CardActionArea sx={{ borderRadius: 3 }}>
                      <div className="flex flex-col items-center gap-4">
                        <Avatar
                          src={rentDetail?.tenant?.profileImage}
                          alt={(rentDetail?.tenant?.firstName).toUpperCase()}
                          sx={{ width: 80, height: 80, border: '3px solid #223981', mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ color: '#223981', fontWeight: 700, fontSize: '1.2rem' }}>
                          {rentDetail?.tenant?.firstName} {rentDetail?.tenant?.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>
                          Tenant
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          <LocalPhoneRoundedIcon sx={{ color: '#223981', fontSize: 22 }} />
                          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '1rem' }}>
                            {rentDetail?.tenant?.phoneNumber}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <EmailRoundedIcon sx={{ color: '#223981', fontSize: 22 }} />
                          <Typography variant="body2" sx={{ color: '#64748b', wordBreak: 'break-all', fontSize: '1rem' }}>
                            {rentDetail?.tenant?.email}
                          </Typography>
                        </div>
                      </div>
                    </CardActionArea>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Section - full width below */}
          <div ref={ref} className="mt-12">
            {showPaymentHistory && (
              <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[220px] w-full mt-4 max-w-6xl mx-auto">
                <PaymentHistoryComponent
                  allPaymentHistory={allPaymentHistory}
                  isProcessing={isProcessing}
                  numberOfPages={numberOfPages}
                  page={page}
                  handlePageChange={handlePageChange}
                  currentCountryCode={currentCountry?.code}
                />
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleShowPayment}
                variant="contained"
                startIcon={<HistoryIcon sx={{ fontSize: 22 }} />}
                sx={{
                  backgroundColor: '#64748b',
                  '&:hover': { backgroundColor: '#475569' },
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 4,
                  boxShadow: 2,
                  minWidth: 180
                }}
              >
                View Payment History
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SingleRentDetail;