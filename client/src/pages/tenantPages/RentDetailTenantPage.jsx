import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSingleRentDetailTenantView,
  getAllPaymentHistory,
} from "../../features/rentDetailTenant/rentDetailTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  PageLoading,
  Footer,
  ImageCarousal,
  PaymentHistoryComponent,
} from "../../components";
import { CardActionArea, Avatar, Button, Paper, Box, Stack, Divider } from "@mui/material";
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
import HistoryIcon from "@mui/icons-material/History";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";

const RentDetailTenantPage = () => {
  const { slug, realEstateId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  const {
    rentDetail,
    isLoading,
    isRentPaid,
    allPaymentHistory,
    isProcessing,
    numberOfPages,
  } = useSelector((state) => state.rentDetailTenant);

  // state to store page for payment history
  const [page, setPage] = useState(1);

  const currentCountry = countries.find(
    (country) => country.label === rentDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  useEffect(() => {
    dispatch(getSingleRentDetailTenantView({ realEstateId }));
  }, [realEstateId, dispatch]);

  // state to show payment history component
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  // function to handle page number change
  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(
      getAllPaymentHistory({ page: value, rentDetailId: rentDetail?._id })
    );
  };

  // function to handle click on show payment history button
  const handleShowPayment = () => {
    dispatch(getAllPaymentHistory({ rentDetailId: rentDetail?._id, page: 1 }));
    setShowPaymentHistory(true); // show payment history component
    setPage(1);
    ref.current.scrollIntoView({ behavior: "smooth" }); // scroll to payment history component on click smoothly
  };

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return (
      <>
        <div className="flex flex-col mx-10">
          <h1 className="mt-6 text-center">Rent Detail Not Found</h1>
          <Button
            size="large"
            variant="text"
            onClick={() => navigate(`/tenant/rental-properties/${slug}`)}
          >
            Go Back
          </Button>
        </div>
      </>
    );

  return (
    <>
      <main className="mb-12 mt-10 mx-4 md:mx-12 flex justify-center">
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, maxWidth: 1100, width: '100%', background: '#f8fafc' }}>
          <h3 className="mb-6 font-heading font-bold text-2xl text-center text-[#223981]">Rent Detail</h3>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>
            <Box flex={1}>
              <ImageCarousal realEstateImages={rentDetail?.realEstate?.realEstateImages} />
            </Box>
            <Box flex={1}>
              <Box mb={2}>
                <h3 className="font-semibold text-xl mb-1">{rentDetail?.realEstate?.title}</h3>
                <p className="text-base text-gray-600 flex items-center gap-1">
                  <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                  {rentDetail?.realEstate?.address?.streetName}, {rentDetail?.realEstate?.address?.city}, {rentDetail?.realEstate?.address?.state}, {rentDetail?.realEstate?.address?.country}
                </p>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box mb={2}>
                <p className="font-roboto text-primaryDark leading-4 ">Rent per month</p>
                <span className="font-semibold text-lg text-primaryDark">
                  {countryToCurrency[currentCountry.code]} {format(rentDetail?.realEstate?.price)}
                </span>
              </Box>
              <Box mb={2}>
                <p className="font-robotoNormal mb-1"><span className="font-medium">Payment Plan:</span> {rentDetail?.paymentPlan}</p>
                <p className="font-robotoNormal mb-1"><span className="font-medium">Current Rent Date:</span> {moment(rentDetail?.currentRentDate.from).format("MMM Do")} - {dateFormatter(rentDetail?.currentRentDate.to)}</p>
                <p className="font-robotoNormal mb-1"><span className="font-medium">Next Rent Due:</span> {dateFormatter(calculateNextDueDate(rentDetail?.currentRentDate.to))}</p>
                <p className="font-robotoNormal mb-1"><span className="font-medium">Rent Status:</span> {isRentPaid === true ? (<><DoneRoundedIcon color="success" /> Paid</>) : (<><CloseRoundedIcon color="error" /> Not Paid</>)}</p>
              </Box>
              <Button
                onClick={handleShowPayment}
                variant="contained"
                size="medium"
                sx={{
                  background: "#1976d2",
                  color: "#fff",
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 3,
                  mt: 2,
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
                  '&:hover': { background: '#115293' },
                }}
                startIcon={<HistoryIcon />}
              >
                View Payment History
              </Button>
            </Box>
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Box mt={4}>
            <Link to={`/tenant/owner-user/${rentDetail?.owner?.slug}`} style={{ textDecoration: 'none' }}>
              <CardActionArea sx={{ borderRadius: 2, maxWidth: 400, mx: 'auto', boxShadow: 2 }}>
                <Box className="p-4" bgcolor="#fff" borderRadius={2}>
                  <Stack direction="row" alignItems="center" gap={1} mb={2}>
                    <h4 className="font-medium text-lg">Owner Info</h4>
                    <ContactsRoundedIcon color="secondary" />
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={2} mb={1}>
                    <Avatar src={rentDetail?.owner?.profileImage} alt={(rentDetail?.owner?.firstName).toUpperCase()} />
                    <h5 className="leading-4 font-serif text-base font-semibold">
                      {rentDetail?.owner?.firstName} {rentDetail?.owner?.lastName}
                    </h5>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                    <span className="ml-2 text-gray-700">{rentDetail?.owner?.phoneNumber}</span>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                    <span className="overflow-auto text-gray-700">{rentDetail?.owner?.email}</span>
                  </Stack>
                </Box>
              </CardActionArea>
            </Link>
          </Box>
          <Box ref={ref} mt={6}>
            {showPaymentHistory && (
              <PaymentHistoryComponent
                allPaymentHistory={allPaymentHistory}
                isProcessing={isProcessing}
                numberOfPages={numberOfPages}
                page={page}
                handlePageChange={handlePageChange}
                currentCountryCode={currentCountry?.code}
              />
            )}
          </Box>
        </Paper>
      </main>
      <Footer />
    </>
  );
};

export default RentDetailTenantPage;
