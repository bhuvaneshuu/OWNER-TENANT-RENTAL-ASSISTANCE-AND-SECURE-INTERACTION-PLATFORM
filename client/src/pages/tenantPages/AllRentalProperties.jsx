import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllTenantRentalProperties } from "../../features/realEstateTenant/realEstateTenantSlice";
import { PageLoading, Footer } from "../../components";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Avatar,
} from "@mui/material";
import { createNumberFormatter, format } from "../../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";

const AllRentalProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allRentalProperties, isLoading } = useSelector(
    (state) => state.realEstateTenant
  );

  useEffect(() => {
    dispatch(getAllTenantRentalProperties());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (allRentalProperties?.length === 0)
    return (
      <div className="mx-auto text-center mt-8">
        <h4 className="mb-4">You do not have any active Rental Properties</h4>
        <Button
          onClick={() => navigate("/tenant")}
          variant="contained"
          sx={{ color: "#fff" }}
        >
          Browse Properties
        </Button>
      </div>
    );
  return (
    <>
      <main
        className="flex flex-col items-center min-h-screen mb-12 mt-8 px-2"
        style={{ background: '#f5faff' }}
      >
        <h3 className="my-6 font-heading font-bold text-center text-2xl text-[#102a43]">
          Your Rental {allRentalProperties?.length > 1 ? "Properties" : "Property"}
        </h3>
        <div className="flex flex-wrap gap-8 justify-center w-full max-w-7xl">
          {allRentalProperties?.map((item) => {
            const {
              title,
              category,
              price,
              address,
              realEstateImages,
              propertyOwner,
              slug,
            } = item?.realEstate;
            const currentCountry = countries.find(
              (country) => country.label === address?.country
            );
            const format = createNumberFormatter(currentCountry?.code);
            return (
              <Card
                sx={{
                  width: 360,
                  bgcolor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  '&:hover': {
                    boxShadow: "0 6px 24px 0 rgba(0,0,0,0.13)",
                    transform: 'translateY(-4px) scale(1.02)',
                  },
                  color: "#102a43",
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 420,
                }}
                key={item._id}
              >
                <Link to={`/tenant/rental-properties/${slug}`} style={{ textDecoration: 'none' }}>
                  <CardActionArea sx={{ borderRadius: 3 }}>
                    <CardMedia
                      component="img"
                      sx={{ height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12, objectFit: 'cover' }}
                      image={realEstateImages[0]}
                      alt={title}
                    />
                    <CardContent sx={{ pb: 1 }}>
                      <h4
                        className="mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-[#1976d2] duration-300 ease-in-out text-lg font-semibold"
                        style={{ maxWidth: "31ch" }}
                      >
                        {title}
                      </h4>
                      <p className="text-sm text-gray-400 mb-1">{category}</p>
                      <p className="font-semibold text-base mb-1">
                        {countryToCurrency[currentCountry.code]} <span>{format(price)}</span> <span className="text-xs text-gray-500">/ month</span>
                      </p>
                      <p className="text-base flex items-center gap-1 text-gray-600">
                        <LocationOnOutlinedIcon color="secondary" fontSize="small" />
                        {address?.streetName}, {address?.city}
                      </p>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <div className="flex p-3 pt-2 items-center mt-auto border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={propertyOwner?.profileImage}
                      alt={propertyOwner?.firstName}
                      sx={{ width: 38, height: 38 }}
                    />
                    <span className="font-semibold text-xs text-gray-700">
                      {propertyOwner?.firstName} {propertyOwner?.lastName}
                    </span>
                  </div>
                  <Link
                    to={`/tenant/owner-user/${propertyOwner?.slug}`}
                    className="ml-auto"
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        color: "#1976d2",
                        borderColor: "#1976d2",
                        borderRadius: 2,
                        fontWeight: 600,
                        px: 2,
                        textTransform: 'none',
                        '&:hover': {
                          background: '#e3f2fd',
                          borderColor: '#115293',
                          color: '#115293',
                        },
                      }}
                    >
                      Owner Details
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllRentalProperties;
