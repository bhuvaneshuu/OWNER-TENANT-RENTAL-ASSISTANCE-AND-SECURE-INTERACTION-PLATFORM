import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getSingleRealEstate,
  clearAlert,
  sendEmailToOwner,
} from "../../features/realEstateTenant/realEstateTenantSlice";
import {
  RealEstateDetailCard,
  PageLoading,
  Footer,
  AlertToast,
  ConfirmModal,
} from "../../components";
import { format } from "../../utils/valueFormatter";
import {
  Button,
  CardActionArea,
  Avatar,
  CircularProgress,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const RealEstateDetail = () => {
  const {
    realEstate,
    isLoading,
    alertFlag,
    alertMsg,
    alertType,
    isSaved,
    isProcessing,
  } = useSelector((state) => state.realEstateTenant);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getSingleRealEstate({ slug }));
  }, [slug, dispatch]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formValues, setFormData] = useState({});

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: realEstate?.propertyOwner?.email,
      from: user?.email,
      subject: `Rental of Property with ID: ${realEstate?.propertyId}`,
      body: `<p>Hi ${realEstate?.propertyOwner?.firstName} ${realEstate?.propertyOwner?.lastName},</p>
      <p>I am interested in renting your property titled <strong>${realEstate?.title}</strong> with ID: ${realEstate?.propertyId}.</p>
      <p>Kindly contact me at ${user?.email} or +977 ${user?.phoneNumber}.</p>
      <p>Visit my profile <a href="${import.meta.env.VITE_APP_BASE_URL}/#/owner/tenant-user/${user?.slug}"><strong>${user?.firstName} ${user?.lastName}</strong></a>.</p>
      <br><br>
      <p>Thank you,</p>
      <p>${user?.firstName} ${user?.lastName},</p>
      <p>${user.address}</p>`,
    };

    setFormData(emailTemplate);
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendEmailToOwner({ formValues }));
    handleModalClose();
  }, [dispatch, formValues, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!realEstate)
    return <h1 className="mt-6 text-center">No real estate found</h1>;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex flex-col lg:flex-row gap-8 py-10 px-2">
        <div className="flex flex-col gap-8 w-full lg:w-8/12 mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6 animate-fadein-scale">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold text-[#223981] mb-2">{realEstate?.title}</h1>
                <span className="text-gray-500 text-sm">ID: {realEstate?.propertyId}</span>
              </div>
              <span className="text-2xl font-bold text-[#1976d2] bg-blue-50 px-6 py-2 rounded-2xl shadow">₹ {format(realEstate?.price)}</span>
            </div>
            <RealEstateDetailCard
              {...realEstate}
              fromTenant
              isSaved={isSaved}
              isProcessing={isProcessing}
            />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#223981]">Description</h3>
              <div className="mb-2 h-1 w-16 bg-blue-100 rounded" />
              <p className="text-base text-gray-700 mb-4">{realEstate?.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-[#223981]">Overview</h3>
              <div className="mb-2 h-1 w-16 bg-blue-100 rounded" />
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <SquareFootRoundedIcon sx={{ color: '#738FA7' }} />
                  <span className="font-semibold">Area:</span>
                  <span>{format(realEstate?.area)} sq. feet</span>
                </div>
                <div className="flex items-center gap-2">
                  <HorizontalSplitRoundedIcon />
                  <span className="font-semibold">Floors:</span>
                  <span>{format(realEstate?.floors)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExploreRoundedIcon sx={{ color: '#29b46e' }} />
                  <span className="font-semibold">Facing:</span>
                  <span>{realEstate?.facing}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="flex flex-col gap-8 w-full lg:w-1/3 mx-auto">
          <Link to={`/tenant/owner-user/${realEstate?.propertyOwner?.slug}`} className="block">
            <CardActionArea sx={{ borderRadius: 3, boxShadow: 2 }}>
              <div className="bg-white rounded-2xl p-6">
                <div className="flex gap-2 items-center mb-2">
                  <h4 className="font-medium text-lg text-[#223981]">Contact Info</h4>
                  <ContactsRoundedIcon color="secondary" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar src={realEstate?.propertyOwner?.profileImage} alt={(realEstate?.propertyOwner?.firstName).toUpperCase()} />
                  <p className="font-semibold text-base">
                    {realEstate?.propertyOwner?.firstName} {realEstate?.propertyOwner?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <LocalPhoneRoundedIcon sx={{ color: '#6D9886' }} />
                  <span className="text-gray-700">{realEstate?.propertyOwner?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EmailRoundedIcon sx={{ color: '#E7AB79' }} />
                  <span className="text-gray-700">{realEstate?.propertyOwner?.email}</span>
                </div>
              </div>
            </CardActionArea>
          </Link>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <form className="overflow-x-auto" onSubmit={handleSendConfirmation}>
              <div className="flex gap-2 items-center mb-2">
                <h4 className="font-medium text-lg text-[#223981]">Send Email</h4>
                <ForwardToInboxRoundedIcon color="tertiary" />
              </div>
              <div className="flex gap-2 items-center mb-1">
                <span className="font-semibold">To:</span>
                <span className="text-gray-700">{realEstate?.propertyOwner?.email}</span>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <span className="font-semibold">From:</span>
                <span className="text-gray-700">{user?.email}</span>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <span className="font-semibold">Subject:</span>
                <span className="text-gray-700">Rental of Property with ID: {realEstate?.propertyId}</span>
              </div>
              <div className="flex gap-2 items-start mb-2">
                <span className="font-semibold">Body:</span>
                <div className="text-sm mt-1">
                  <p className="mb-2 text-gray-700">
                    Hi {realEstate?.propertyOwner?.firstName} {realEstate?.propertyOwner?.lastName},
                  </p>
                  <p className="mb-2 text-gray-700">
                    I am interested in renting your property titled <strong>{realEstate?.title}</strong> with ID: {realEstate?.propertyId}.
                  </p>
                  <p className="mb-2 text-gray-700">
                    Kindly contact me at {user?.email} or +977 {user?.phoneNumber}.
                  </p>
                  <p className="mb-2 text-gray-700">
                    Visit my profile at <strong>{user?.firstName} {user?.lastName}</strong>.
                  </p>
                  <p className="mt-2 text-gray-700">Thank you,</p>
                  <p className="text-gray-700">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: "#1976d2",
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
                      background: "#115293",
                      boxShadow: "none",
                    },
                  }}
                  size="medium"
                  startIcon={<SendRoundedIcon />}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <CircularProgress
                      size={26}
                      sx={{ color: "#fff", width: "25%" }}
                    />
                  ) : (
                    "Send Email"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </aside>
      </main>
      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleAlertClose}
      />
      <Footer />
    </>
  );
};

export default RealEstateDetail;
