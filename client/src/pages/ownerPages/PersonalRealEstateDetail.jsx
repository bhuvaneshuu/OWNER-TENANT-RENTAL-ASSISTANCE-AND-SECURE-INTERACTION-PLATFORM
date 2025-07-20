import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getRealEstateDetail,
  deleteProperty,
  clearAlert,
} from "../../features/realEstateOwner/realEstateOwnerSlice";
import {
  PageLoading,
  Footer,
  ImageCarousal,
  ConfirmModal,
  AlertToast,
} from "../../components";
import { dateFormatter, createNumberFormatter } from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import countryToCurrency from "country-to-currency";
import { countries } from "../../utils/countryList";

const PersonalRealEstateDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRealEstateDetail({ slug }));
  }, [slug, dispatch]);

  const {
    realEstate,
    isLoading,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    postSuccess,
  } = useSelector((store) => store.realEstateOwner);

  const currentCountry = countries.find(
    (country) => country.label === realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  // Redirect to detail page of the property after successful contract creation
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, slug]);

  //close the alert toast
  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //handel modal open and close state
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleDeleteProperty = useCallback(() => {
    dispatch(deleteProperty({ slug }));
    handleModalClose();
  }, [dispatch, slug, handleModalClose]);

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
              {realEstate?.status === true ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, py: 1 }}
                    size="medium"
                    onClick={() => {
                      navigate(`/owner/real-estate/update/${slug}`);
                    }}
                    startIcon={<BorderColorIcon />}
                  >
                    Edit
                  </Button>
                  <Link
                    to={`/owner/contract/create`}
                    state={{
                      realEstateId: realEstate?._id,
                      title: realEstate?.title,
                      price: realEstate?.price,
                      slug: slug,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, py: 1, background: 'linear-gradient(90deg, #223981 0%, #3b82f6 100%)' }}
                      size="medium"
                      startIcon={<GavelIcon />}
                    >
                      Create Contract
                    </Button>
                  </Link>
                  <Button
                    disabled={isProcessing || (alertFlag && alertType === 'success')}
                    variant="contained"
                    color="error"
                    sx={{ color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, py: 1 }}
                    size="medium"
                    onClick={handleModalOpen}
                    startIcon={<DeleteForeverRoundedIcon />}
                  >
                    {isProcessing ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      'Delete Property'
                    )}
                  </Button>
                </>
              ) : (
                <Link to={`/owner/contract/${realEstate?._id}/${slug}`}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    sx={{ color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, py: 1 }}
                    startIcon={<ArticleIcon />}
                  >
                    View Contract
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div>
          <ConfirmModal open={open} handleModalClose={handleModalClose}>
            <h3 className="text-center">Confirm Delete?</h3>
            <p className="text-center my-4">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Close
              </Button>

              <Button
                onClick={handleDeleteProperty}
                color="success"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </ConfirmModal>
        </div>
        <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleAlertClose}
        />
      </main>
      <Footer />
    </>
  );
};

export default PersonalRealEstateDetail;
