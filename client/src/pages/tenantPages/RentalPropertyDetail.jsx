import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSingleRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { PageLoading, Footer, ImageCarousal } from "../../components";
import { format, dateFormatter, createNumberFormatter } from "../../utils/valueFormatter";
import { CardActionArea, Avatar, Button, Paper, Box, Stack, Divider } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MailIcon from "@mui/icons-material/Mail";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";

const RentalPropertyDetail = () => {
  const { realEstate, isLoading } = useSelector(
    (state) => state.realEstateTenant
  );
  const dispatch = useDispatch();
  const { slug } = useParams();
  const currentCountry = countries.find(
    (country) => country.label === realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  useEffect(() => {
    dispatch(getSingleRealEstate({ slug }));
  }, [slug, dispatch]);

  if (isLoading) return <PageLoading />;
  if (!realEstate)
    return <h1 className="mt-6 text-center">No real estate found</h1>;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white pb-10">
        {/* Full-width Hero Image with overlay */}
        <div className="relative w-full">
          <div className="h-[340px] md:h-[440px] w-full overflow-hidden">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
            <ImageCarousal realEstateImages={realEstate?.realEstateImages} />
          </div>
          {/* Overlayed Title, Price, Address */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20 pointer-events-none">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2 animate-fadein-delay">{realEstate?.title}</h1>
            <div className="flex items-center gap-2 mb-2 animate-fadein-delay">
              <LocationOnOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
              <span className="text-white text-lg md:text-2xl font-semibold drop-shadow">{realEstate?.address?.streetName}, {realEstate?.address?.city}, {realEstate?.address?.state}, {realEstate?.address?.country}</span>
            </div>
            <span className="text-white text-2xl md:text-4xl font-bold bg-black/40 px-6 py-2 rounded-2xl shadow-lg animate-shadow-pulse">
              {countryToCurrency[currentCountry.code]} {format(realEstate?.price)}
            </span>
          </div>
        </div>
        {/* Main Info Card: category, posted date, stats, description, and actions */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 animate-fadein-scale">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-indigo-700 font-bold text-lg flex items-center gap-2">
                  <ExploreRoundedIcon sx={{ color: '#29b46e' }} /> {realEstate?.category}
                </span>
                <span className="text-gray-500 text-sm">Posted on: {dateFormatter(realEstate?.createdAt)}</span>
                <span className="text-gray-400 text-xs">Id: {realEstate?.propertyId}</span>
              </div>
              <div className="flex flex-wrap gap-6 mt-2 md:mt-0">
                <div className="flex items-center gap-2">
                  <SquareFootRoundedIcon sx={{ color: '#738FA7' }} />
                  <span className="font-semibold text-[#223981]">{format(realEstate?.area)} sq. feet</span>
                </div>
                <div className="flex items-center gap-2">
                  <HorizontalSplitRoundedIcon />
                  <span className="font-semibold text-[#223981]">{format(realEstate?.floors)} {realEstate?.floors > 1 ? 'floors' : 'floor'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExploreRoundedIcon sx={{ color: '#29b46e' }} />
                  <span className="font-semibold text-[#223981]">{realEstate?.facing}</span>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="flex items-start gap-4 mt-2">
              <ArticleIcon sx={{ color: '#223981', fontSize: 32 }} />
              <div>
                <h3 className="font-semibold text-xl text-[#223981] mb-2">Description</h3>
                <p className="text-lg text-[#475569] tracking-normal">
                  {realEstate?.description}
                </p>
              </div>
            </div>
            {/* Action Buttons at the bottom of the card */}
            <div className="flex flex-wrap gap-4 mt-6 items-center justify-center">
              <Link to={`/tenant/contract/${realEstate?._id}/${slug}`} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "#f9a825", // Orange
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    boxShadow: "none",
                    '&:hover': {
                      background: "#c17900",
                      boxShadow: "none",
                    },
                  }}
                  size="medium"
                  startIcon={<ArticleIcon />}
                >
                  View Contract
                </Button>
              </Link>
              <Link to={`/tenant/rentDetail/${realEstate?._id + "/" + slug}`} state={{ realEstateId: realEstate._id }} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "#1565c0", // Blue
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    boxShadow: "none",
                    '&:hover': {
                      background: "#003c8f",
                      boxShadow: "none",
                    },
                  }}
                  size="medium"
                  startIcon={<MapsHomeWorkIcon />}
                >
                  Rent Detail
                </Button>
              </Link>
              <Link to={`/tenant/send-complaint/${slug}`} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "#d32f2f", // Red
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    boxShadow: "none",
                    '&:hover': {
                      background: "#9a0007",
                      boxShadow: "none",
                    },
                  }}
                  size="medium"
                  startIcon={<MailIcon />}
                >
                  Send Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8">
          <Link to={`/tenant/owner-user/${realEstate?.propertyOwner?.slug}`} style={{ textDecoration: 'none' }}>
            <CardActionArea sx={{ borderRadius: 2, maxWidth: 400, mx: 'auto', boxShadow: 2 }}>
              <Box className="p-4" bgcolor="#fff" borderRadius={2}>
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                  <h4 className="font-medium text-lg">Contact Info</h4>
                  <ContactsRoundedIcon color="secondary" />
                </Stack>
                <Stack direction="row" alignItems="center" gap={2} mb={1}>
                  <Avatar src={realEstate?.propertyOwner?.profileImage} alt={(realEstate?.propertyOwner?.firstName).toUpperCase()} />
                  <p className="leading-4 font-semibold text-base">
                    {realEstate?.propertyOwner?.firstName} {realEstate?.propertyOwner?.lastName}
                  </p>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1} mb={1}>
                  <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                  <span className="ml-2 text-gray-700">{realEstate?.propertyOwner?.phoneNumber}</span>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                  <span className="overflow-auto text-gray-700">{realEstate?.propertyOwner?.email}</span>
                </Stack>
              </Box>
            </CardActionArea>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RentalPropertyDetail;
