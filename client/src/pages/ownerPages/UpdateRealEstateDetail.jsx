import { useCallback, useEffect } from "react";
import { AlertToast, PageLoading, UpdatePropertyForm } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  clearAlert,
  updateRealEstateDetail,
  getRealEstateDetail,
} from "../../features/realEstateOwner/realEstateOwnerSlice";
import postRealEstateImg from "../../assets/images/postRealEstateImg.svg";
import postRealEstateImg2 from "../../assets/images/postRealEstateImg2.svg";
import postRealEstateImg3 from "../../assets/images/postRealEstateImg3.svg";

const UpdateRealEstateDetail = () => {
  const {
    alertFlag,
    alertMsg,
    alertType,
    isLoading,
    realEstate,
    postSuccess,
    isProcessing,
  } = useSelector((store) => store.realEstateOwner);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getRealEstateDetail({ slug }));
  }, [slug, dispatch]);

  // Redirect to real estate detail page of the property after successful update
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${realEstate?.slug}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, realEstate?.slug]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    dispatch(updateRealEstateDetail({ slug, formValues }));
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  if (isLoading) return <PageLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-10 flex flex-col items-center justify-center animate-fadein-scale">
      <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center justify-center animate-fadein-scale">
        {/* Illustration Section */}
        <div className="hidden md:flex flex-col items-center justify-center gap-4 md:w-5/12">
          <img src={postRealEstateImg} className="w-full max-w-xs rounded-2xl shadow-lg animate-fadein-delay" alt="Cartoon of a person holding a card" />
          <img src={postRealEstateImg2} className="w-full max-w-xs rounded-2xl shadow-lg animate-fadein-delay" alt="Cartoon of a person holding a card" />
          <img src={postRealEstateImg3} className="w-full max-w-xs rounded-2xl shadow-lg animate-fadein-delay" alt="Cartoon of a person holding a card" />
        </div>
        {/* Update Form Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-100 p-8 flex-1 max-w-xl w-full animate-fadein-scale">
          <form onSubmit={handleSubmit} id="form" className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 mb-4">
              <h3 className="font-heading font-extrabold text-2xl text-[#223981] tracking-wide drop-shadow-lg">Update Property Details</h3>
              <p className="text-gray-500 text-base font-medium">Enter the updated details of your property</p>
            </div>
            <UpdatePropertyForm {...realEstate} isProcessing={isProcessing} />
          </form>
        </div>
      </main>
      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </div>
  );
};

export default UpdateRealEstateDetail;
