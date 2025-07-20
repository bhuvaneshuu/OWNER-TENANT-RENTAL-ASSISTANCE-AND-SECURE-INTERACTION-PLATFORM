import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTenantUserDetails,
  addOrRemoveContact,
  clearAlert,
} from "../../features/ownerUser/ownerUserSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Footer, PageLoading, AlertToast } from "../../components";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Button } from "@mui/material";
import ContactPageRoundedIcon from "@mui/icons-material/ContactPageRounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import CircularProgress from "@mui/material/CircularProgress";
import ImageViewer from "react-simple-image-viewer";
import MessageIcon from "@mui/icons-material/Message";
import axiosFetch from "../../utils/axiosCreate";

const TenantUserDetailPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isLoading,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    isContact,
  } = useSelector((state) => state.ownerUser);

  useEffect(() => {
    dispatch(getTenantUserDetails({ slug }));
  }, [dispatch, slug]);

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  // toggle open and close of ImageViewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // open the ImageViewer and set the currentImageIndex to the index of the image that was clicked
  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true);
  }, []);

  // close the ImageViewer
  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  if (isLoading) return <PageLoading />;

  if (!user)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>User Not found</h1>
      </div>
    );

  return (
    <div className="min-h-[120vh] flex flex-col">
      {/* Hero Banner with blurred background */}
      <div className="relative w-full h-[160px] md:h-[220px] overflow-hidden">
        <img
          src={user?.profileImage}
          alt="profile-bg"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-md brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
      </div>
      {/* Floating Profile Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-32 md:-mt-40 mb-12 animate-fadein-scale">
        <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col items-center gap-6 animate-fadein-scale">
          {/* Profile Image */}
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-xl border-4 border-blue-200 -mt-24 md:-mt-32 bg-white">
            <img
              src={user?.profileImage}
              alt="profile"
              className="w-full h-full object-cover"
              onClick={() => openImageViewer(0)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          {isViewerOpen && (
            <ImageViewer
              src={[user?.profileImage]}
              currentIndex={0}
              onClose={closeImageViewer}
              disableScroll={false}
              backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)" }}
              closeOnClickOutside={true}
            />
          )}
          {/* Name and Info */}
          <h2 className="text-3xl font-extrabold text-[#223981] text-center drop-shadow-lg animate-fadein-delay flex items-center gap-2">
            <ContactPageRoundedIcon sx={{ color: '#223981', fontSize: 32 }} />
            {user?.firstName} {user?.lastName}
          </h2>
          <div className="flex flex-col gap-2 items-center text-[#475569] animate-fadein-delay">
            <div className="flex gap-2 items-center">
              <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
              <span>{user?.address}</span>
            </div>
            <div className="flex gap-2 items-center">
              <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
              <span>+977 {user?.phoneNumber}</span>
            </div>
            <div className="flex gap-2 items-center">
              <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
              <span>{user?.email}</span>
            </div>
          </div>
          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-4 mt-4 w-full justify-center animate-fadein-delay">
            {isContact ? (
              <Button
                disabled={isProcessing}
                onClick={() => dispatch(addOrRemoveContact({ id: user?._id }))}
                variant="contained"
                color="error"
                startIcon={<PersonRemoveAlt1RoundedIcon />}
                size="large"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  letterSpacing: 1,
                  minWidth: 120,
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={26} sx={{ color: "#fff" }} />
                ) : (
                  "Remove"
                )}
              </Button>
            ) : (
              <Button
                disabled={isProcessing}
                onClick={() => dispatch(addOrRemoveContact({ id: user?._id }))}
                variant="contained"
                color="secondary"
                startIcon={<ContactPageRoundedIcon />}
                size="large"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  letterSpacing: 1,
                  minWidth: 120,
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={26} sx={{ color: "#fff" }} />
                ) : (
                  "Add"
                )}
              </Button>
            )}
            <Button
              variant="contained"
              size="large"
              sx={{
                color: "white",
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1,
                letterSpacing: 1,
                minWidth: 120,
                background: 'linear-gradient(90deg, #223981 0%, #3b82f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1a2a5c 0%, #2563eb 100%)',
                },
              }}
              startIcon={<MessageIcon />}
              onClick={async () => {
                try {
                  // 1. Create or get chat
                  const { data } = await axiosFetch.post("/chat", { userId: user._id });
                  // 2. Navigate to chat page with chat object (no initial message)
                  navigate(`/owner/chat`, { state: data });
                } catch (err) {
                  alert("Failed to start chat");
                }
              }}
            >
              Chat
            </Button>
          </div>
        </div>
        <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleClose}
        />
      </main>
      <Footer />
    </div>
  );
};

export default TenantUserDetailPage;
