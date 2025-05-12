import { Link, useNavigate } from "react-router-dom";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Card, CardContent, CardMedia, CardActionArea } from "@mui/material";
import { Button } from "@mui/material";
import { useContext } from "react";
import AuthContext from "./Authcontext";

const ContactsCard = ({
  firstName,
  lastName,
  address,
  profileImage,
  email,
  slug,
  tenant,
  tenantId, // This is the ID of the person you're initiating the chat with
}) => {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const handleChat = async () => {
    try {
      const response = await fetch(
        tenant
          ? "http://localhost:5000/api/chat/owner/send-message"
          : "http://localhost:5000/api/chat/tenant/send-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            to: tenantId,
            message: "👋 Hello!", // Optional default message
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data?.newMessage?._id) {
        navigate(tenant ? "/owner/chat" : "/tenant/chat"); // Navigate to chat section
      } else {
        alert(data.msg || "Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Something went wrong while initiating chat.");
    }
  };

  return (
    <Card
      sx={{
        width: 345,
        bgcolor: "transparent",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 5px 0 rgba(0,0,0,0.2)",
        },
        color: "#102a43",
      }}
    >
      <Link
        to={`/${tenant ? "tenant/owner-user" : "owner/tenant-user"}/${slug}`}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            sx={{ maxHeight: 260 }}
            image={profileImage}
            alt={firstName}
          />
          <CardContent>
            <h4
              className="mb-1 hover:text-primaryDark transition-all duration-300 ease-in-out"
              style={{ maxWidth: "31ch" }}
            >
              {firstName} {lastName}
            </h4>
            <p className="text-sm">
              <EmailRoundedIcon color="secondary" /> {email}
            </p>
            <p className="text-base text-gray-500">
              <LocationOnOutlinedIcon sx={{ color: "#019149" }} /> {address}
            </p>
          </CardContent>
        </CardActionArea>
      </Link>

      {/* Chat Button Outside Link */}
      <div style={{ padding: "8px", textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleChat}
          sx={{ backgroundColor: "#b8a8f3", color: "black" }}
        >
          CHAT
        </Button>
      </div>
    </Card>
  );
};

export default ContactsCard;
