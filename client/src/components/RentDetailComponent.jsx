import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Avatar,
} from "@mui/material";
import {
  dateFormatter,
  calculateNextDueDate,
  createNumberFormatter,
} from "../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { countries } from "../utils/countryList";
import countryToCurrency from "country-to-currency";

const RentDetailComponent = ({
  _id,
  tenant,
  realEstate,
  paymentPlan,
  currentRentDate,
}) => {
  // Guard clause: ensure required props exist
  if (!realEstate || !tenant) return null;

  const currentCountry = countries.find(
    (country) => country.label === realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  return (
    <Card
      sx={{
        width: 360,
        minHeight: 420,
        bgcolor: "white",
        borderRadius: 4,
        boxShadow: "0 4px 24px 0 rgba(34,57,129,0.10)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 0,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        '&:hover': {
          boxShadow: "0 8px 32px 0 rgba(34,57,129,0.16)",
        },
      }}
    >
      {/* Navy accent bar */}
      <div style={{ width: '100%', height: 8, background: '#223981' }} />
      <Link to={`/owner/rentDetail/${_id}/${realEstate?.slug}`} style={{ textDecoration: 'none' }}>
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{ width: '100%', height: 170, objectFit: 'cover', borderRadius: '0 0 16px 16px' }}
            image={realEstate?.realEstateImages?.[0] || "/default-image.jpg"}
            alt={realEstate?.title || "Real Estate Image"}
          />
          <CardContent sx={{ pb: 1 }}>
            <h4
              className="mb-1 font-bold text-lg text-[#223981] overflow-hidden overflow-ellipsis whitespace-nowrap"
              style={{ maxWidth: "31ch" }}
            >
              {realEstate?.title}
            </h4>
            <div className="mb-2">
              <p className="font-semibold text-base text-[#223981]">
                {countryToCurrency[currentCountry?.code] || "$"} <span>{format(realEstate?.price)}</span> / month
              </p>
              <p className="text-gray-500 text-sm">
                <LocationOnOutlinedIcon color="secondary" fontSize="small" /> {realEstate?.address?.streetName}, {realEstate?.address?.city}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm mb-2">
              <p><span className="font-medium">Current Rent Date:</span> {dateFormatter(currentRentDate?.from)}</p>
              <p><span className="font-medium">Next Rent Due:</span> {dateFormatter(calculateNextDueDate(currentRentDate?.to))}</p>
              <p><span className="font-medium">Payment Plan:</span> {paymentPlan}</p>
            </div>
          </CardContent>
        </CardActionArea>
      </Link>
      {/* Divider */}
      <div className="w-full h-[1px] bg-slate-200 my-1" />
      {/* Tenant Info Section */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={tenant?.profileImage}
            alt={tenant?.firstName}
            sx={{ width: 36, height: 36, border: '2px solid #223981' }}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-[#223981]">{tenant?.firstName} {tenant?.lastName}</span>
            <span className="text-xs text-gray-500">Tenant</span>
          </div>
        </div>
        <Link to={`/owner/tenant-user/${tenant?.slug}`} style={{ textDecoration: 'none' }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: '#223981',
              borderColor: '#223981',
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              boxShadow: 'none',
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#e3eafc',
                borderColor: '#1a2a5c',
                color: '#1a2a5c',
                boxShadow: '0 2px 8px 0 rgba(34,57,129,0.10)',
              },
            }}
          >
            Tenant Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default RentDetailComponent;
