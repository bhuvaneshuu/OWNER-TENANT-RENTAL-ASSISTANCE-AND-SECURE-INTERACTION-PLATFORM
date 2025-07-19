import { Link } from "react-router-dom";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { Card, CardContent, CardMedia, Button, Box } from "@mui/material";

const MAIN_COLOR = "#223981"; // Deep navy blue
const AVATAR_BG = "#223981"; // Use same navy for avatar background

const ContactsCard = ({
  firstName,
  lastName,
  address,
  profileImage,
  email,
  slug,
  tenant,
}) => {
  return (
    <Card
      sx={{
        width: 350,
        minHeight: 420,
        bgcolor: "white",
        borderRadius: 4,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        p: 0,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        '&:hover': {
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
        },
      }}
    >
      {/* Accent bar */}
      <Box sx={{ width: "100%", height: 10, bgcolor: MAIN_COLOR }} />
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", pt: 3 }}>
        {profileImage ? (
          <CardMedia
            component="img"
            sx={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", mb: 2, boxShadow: 2, bgcolor: AVATAR_BG }}
            image={profileImage}
            alt={firstName}
          />
        ) : (
          <Box sx={{ width: 90, height: 90, borderRadius: "50%", bgcolor: AVATAR_BG, display: "flex", alignItems: "center", justifyContent: "center", mb: 2, boxShadow: 2 }}>
            <PersonIcon sx={{ fontSize: 48, color: "#fff" }} />
          </Box>
        )}
        <CardContent sx={{ p: 0, textAlign: "center" }}>
          <h4 className="mb-1 font-bold text-lg" style={{ maxWidth: "31ch" }}>
            {firstName} {lastName}
          </h4>
          <p className="text-sm flex items-center justify-center gap-1 mb-1">
            <EmailRoundedIcon color="secondary" fontSize="small" /> {email}
          </p>
          <p className="text-base text-gray-500 flex items-center justify-center gap-1">
            <LocationOnOutlinedIcon sx={{ color: "#019149" }} fontSize="small" /> {address}
          </p>
        </CardContent>
      </Box>
      <Link
        to={`/${tenant ? "tenant/owner-user" : "owner/tenant-user"}/${slug}`}
        style={{ width: "100%", textDecoration: "none", marginTop: 24 }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            py: 1.2,
            fontSize: "1rem",
            mt: 2,
            boxShadow: "none",
            borderWidth: 2,
            backgroundColor: MAIN_COLOR,
            color: '#fff', // Ensure button text is always white
            '&:hover': {
              backgroundColor: MAIN_COLOR,
              borderColor: MAIN_COLOR,
              color: 'grey',
            },
          }}
        >
          View
        </Button>
      </Link>
    </Card>
  );
};

export default ContactsCard;