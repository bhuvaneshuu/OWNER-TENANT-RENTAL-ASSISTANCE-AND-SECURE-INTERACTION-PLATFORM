import { useNavigate, Link } from "react-router-dom";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Card, CardContent, CardMedia, CardActionArea, Button } from "@mui/material";
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
  tenantId, // recipient's userId
}) => {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const handleChat = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ userId: tenantId }),
      });

      const data = await response.json();
      if (response.ok && data?._id) {
        navigate("/owner/chat", {
          state: {
            recipientId: tenantId,
            recipientName: `${firstName} ${lastName}`,
            recipientImage: profileImage,
          },
        });
      } else {
        alert("Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <Card sx={{ width: 345, bgcolor: "transparent", boxShadow: "none" }}>
      <Link to={`/${tenant ? "tenant/owner-user" : "owner/tenant-user"}/${slug}`}>
        <CardActionArea>
          <CardMedia component="img" sx={{ maxHeight: 260 }} image={profileImage} alt={firstName} />
          <CardContent>
            <h4>{firstName} {lastName}</h4>
            <p><EmailRoundedIcon color="secondary" /> {email}</p>
            <p><LocationOnOutlinedIcon sx={{ color: "#019149" }} /> {address}</p>
          </CardContent>
        </CardActionArea>
      </Link>
      <div style={{ padding: "8px", textAlign: "center" }}>
        <Button variant="contained" fullWidth onClick={handleChat} sx={{ backgroundColor: "#b8a8f3", color: "black" }}>
          CHAT
        </Button>
      </div>
    </Card>
  );
};

export default ContactsCard;
