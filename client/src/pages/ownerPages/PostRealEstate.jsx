import { useState, useCallback, useEffect } from "react";
import { FormTextField, FormSelectField, AlertToast, CountrySelectField } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  postRealEstate,
  clearAlert,
} from "../../features/realEstateOwner/realEstateOwnerSlice";

import postRealEstateImg from "../../assets/images/postRealEstateImg.svg";
import postRealEstateImg2 from "../../assets/images/postRealEstateImg2.svg";
import postRealEstateImg3 from "../../assets/images/postRealEstateImg3.svg";

import {
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import BungalowIcon from "@mui/icons-material/Bungalow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import countryToCurrency from "country-to-currency";

const PostRealEstate = () => {
  const { alertFlag, alertMsg, alertType, isLoading, postSuccess, realEstate } =
    useSelector((store) => store.realEstateOwner);

  const initialFormValues = {
    title: "",
    price: "",
    description: "",
    streetName: "",
    city: "",
    state: "",
    country: "",
    countryCode: "",
    category: "",
    area: "",
    floors: "",
    facing: "",
  };

  const [values, setFormValues] = useState(initialFormValues);

  const [images, setImages] = useState(null);

  const handleImagesChange = (e) => {
    const arr = Array.from(e.target.files);
    setImages(arr.map((file) => URL.createObjectURL(file)));
  };

  const previewImage = () => {
    if (images) {
      return images.map((image, index) => {
        return (
          <div className="p-2" key={index}>
            <img src={image} alt="profilePreview" className="h-24 md:h-28" />
          </div>
        );
      });
    }
  };

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    dispatch(postRealEstate({ formData }));
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

  const navigate = useNavigate();

  // Redirect to detail page of the property after successful posting
  useEffect(() => {
    if (postSuccess) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${realEstate?.slug}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [postSuccess, navigate, realEstate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col justify-between">
      <main className="flex flex-col items-center justify-center flex-1 py-8 px-2">
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Illustration */}
          <div className="hidden md:flex flex-col justify-center items-center bg-blue-900 p-8 w-1/2">
            <img src={postRealEstateImg2} alt="Post Property" className="w-64 mb-6 drop-shadow-xl" />
            <h2 className="text-white text-2xl font-bold mb-2 text-center">List Your Property</h2>
            <p className="text-blue-100 text-center">Reach thousands of tenants by posting your property here!</p>
          </div>
          {/* Form Card */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <form onSubmit={handleSubmit} id="form" className="space-y-6">
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-blue-900 mb-1">Post Your Property</h3>
                <p className="text-gray-500 text-sm">Enter the details of your property below.</p>
              </div>
              {/* Initial Details */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1"><InfoIcon fontSize="small" /> Initial Details</h5>
                <FormTextField
                  label="Title"
                  name="title"
                  type="text"
                  value={values.title}
                  handleChange={handleChange}
                  autoFocus={true}
                />
                <TextField
                  label="Description"
                  required
                  multiline
                  rows={3}
                  color="primary"
                  placeholder="Description of your property"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  className="bg-gray-50 rounded"
                  fullWidth
                />
              </div>
              {/* Address */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1"><LocationOnIcon fontSize="small" /> Address</h5>
                <FormTextField
                  label="Street Name / Landmark"
                  name="streetName"
                  type="text"
                  value={values.streetName}
                  handleChange={handleChange}
                />
                <div className="flex gap-2">
                  <FormTextField
                    label="City"
                    name="city"
                    type="text"
                    value={values.city}
                    handleChange={handleChange}
                  />
                  <FormTextField
                    label="State"
                    name="state"
                    type="text"
                    value={values.state}
                    handleChange={handleChange}
                  />
                </div>
                <CountrySelectField
                  value={values.country}
                  setFormValues={setFormValues}
                  handleChange={handleChange}
                />
              </div>
              {/* Property Info */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1"><BungalowIcon fontSize="small" /> Property Info</h5>
                <div className="flex gap-2">
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="Rent per month"
                    required
                    value={values.price}
                    color="primary"
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">{countryToCurrency[values.countryCode]}</InputAdornment>
                      ),
                    }}
                    className="bg-gray-50 rounded flex-1"
                    fullWidth
                  />
                  <FormSelectField
                    label="Category"
                    name="category"
                    options={[
                      "House",
                      "Apartment",
                      "Room",
                      "Shop Space",
                    ]}
                    value={values.category}
                    handleChange={handleChange}
                  />
                </div>
                <div className="flex gap-2">
                  <FormTextField
                    label="Area (sq ft)"
                    name="area"
                    type="number"
                    value={values.area}
                    handleChange={handleChange}
                  />
                  <FormTextField
                    label="Floors"
                    name="floors"
                    type="number"
                    value={values.floors}
                    handleChange={handleChange}
                  />
                  <FormSelectField
                    label="Facing"
                    name="facing"
                    options={["East", "West", "North", "South"]}
                    value={values.facing}
                    handleChange={handleChange}
                  />
                </div>
              </div>
              {/* Images */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1"><PermMediaIcon fontSize="small" /> Property Images</h5>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex flex-wrap gap-2">{previewImage()}</div>
              </div>
              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="rounded-lg py-3 text-lg font-semibold shadow-md bg-blue-900 hover:bg-blue-800 text-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Post Property"}
                </Button>
              </div>
              {/* Alert Toast */}
              <AlertToast
                open={alertFlag}
                handleClose={handleClose}
                severity={alertType}
                message={alertMsg}
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostRealEstate;
