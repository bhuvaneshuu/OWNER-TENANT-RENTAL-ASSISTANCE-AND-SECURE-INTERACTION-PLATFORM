import {
  Button,
  CardActionArea,
  Avatar,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { createNumberFormatter } from "../utils/valueFormatter";
import { Link } from "react-router-dom";
import countryToCurrency from "country-to-currency";
import { countries } from "../utils/countryList";

const RealEstateCard = ({
  title,
  slug,
  price,
  category,
  address,
  realEstateImages,
  propertyOwner,
  fromOwnerUser,
  fromUserProfile,
}) => {
  const currentCountry = countries.find(
    (country) => country.label === address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);
  return (
    <Link
      to={
        fromOwnerUser
          ? `/owner/real-estate/${slug}`
          : `/tenant/real-estate/${slug}`
      }
      style={{ textDecoration: 'none' }}
    >
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
          transition: "box-shadow 0.2s, transform 0.2s",
          '&:hover': {
            boxShadow: "0 8px 32px 0 rgba(34,57,129,0.16)",
            transform: 'translateY(-4px) scale(1.02)',
          },
        }}
      >
        <div style={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '0 0 16px 16px' }}
            image={realEstateImages[0]}
            alt={title}
          />
          {/* Category badge */}
          <span style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: '#e3f0ff',
            color: '#223981',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderRadius: 8,
            padding: '2px 12px',
            boxShadow: '0 1px 4px 0 rgba(34,57,129,0.08)',
            letterSpacing: 0.5,
          }}>{category}</span>
        </div>
        <CardContent sx={{ pb: 1 }}>
          <h4
            className="mb-1 font-bold text-lg text-[#223981] overflow-hidden overflow-ellipsis whitespace-nowrap"
            style={{ maxWidth: "31ch" }}
          >
            {title}
          </h4>
          <p className="font-semibold text-xl text-[#223981] mb-1">
            {countryToCurrency[currentCountry.code]} <span>{format(price)}</span> <span className="text-base font-normal text-gray-500">/ month</span>
          </p>
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <LocationOnOutlinedIcon color="secondary" fontSize="small" />
            <span>{address?.streetName}, {address?.city}</span>
          </div>
        </CardContent>
        {/* Owner info bar (if not owner) */}
        {!fromOwnerUser && !fromUserProfile && (
          <div className="flex items-center justify-between bg-slate-50 rounded-b-2xl px-4 py-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Avatar
                src={propertyOwner?.profileImage}
                alt={propertyOwner?.firstName}
                sx={{ width: 36, height: 36, border: '2px solid #223981' }}
              />
              <span className="font-semibold text-sm text-[#223981]">
                {propertyOwner?.firstName} {propertyOwner?.lastName}
              </span>
            </div>
            <Link
              className="ml-auto"
              to={`/tenant/owner-user/${propertyOwner?.slug}`}
              style={{ textDecoration: 'none' }}
            >
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
                Owner Details
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </Link>
  );
};

export default RealEstateCard;