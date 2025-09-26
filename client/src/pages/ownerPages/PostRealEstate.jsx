import { useState, useCallback, useEffect } from "react";
import { FormTextField, FormSelectField, AlertToast, CountrySelectField } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postRealEstate, clearAlert } from "../../features/realEstateOwner/realEstateOwnerSlice";

import postRealEstateImg2 from "../../assets/images/postRealEstateImg2.svg";

import { Button, CircularProgress, TextField, InputAdornment } from "@mui/material";
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const previewImage = () => {
    return imagePreviews.map((image, index) => (
      <div className="p-2" key={index}>
        <img src={image} alt="preview" className="h-24 md:h-28" />
      </div>
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("streetName", values.streetName);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("country", values.country);
    formData.append("category", values.category);
    formData.append("area", values.area);
    formData.append("floors", values.floors);
    formData.append("facing", values.facing);
    imageFiles.forEach((file) => {
      formData.append("realEstateImages", file);
    });

    dispatch(postRealEstate({ formData }));
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") return;
      dispatch(clearAlert());
    },
    [dispatch]
  );

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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Initial Details */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1">
                  <InfoIcon fontSize="small" /> Initial Details
                </h5>
                <FormTextField
                  label="Title"
                  name="title"
                  value={values.title}
                  handleChange={handleChange}
                  autoFocus
                />
                <TextField
                  label="Description"
                  required
                  multiline
                  rows={3}
                  placeholder="Description of your property"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  fullWidth
                  className="bg-gray-50 rounded"
                />
              </div>
              {/* Address */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1">
                  <LocationOnIcon fontSize="small" /> Address
                </h5>
                <FormTextField
                  label="Street Name / Landmark"
                  name="streetName"
                  value={values.streetName}
                  handleChange={handleChange}
                />
                <div className="flex gap-2">
                  <FormTextField
                    label="City"
                    name="city"
                    value={values.city}
                    handleChange={handleChange}
                  />
                  <FormTextField
                    label="State"
                    name="state"
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
                <h5 className="font-semibold text-blue-900 flex items-center gap-1">
                  <BungalowIcon fontSize="small" /> Property Info
                </h5>
                <div className="flex gap-2">
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{countryToCurrency[values.countryCode]}</InputAdornment>,
                    }}
                    fullWidth
                    className="bg-gray-50 rounded"
                  />
                  <FormSelectField
                    label="Category"
                    name="category"
                    options={[
                      "House",
                      "Apartment",
                      "Room",
                      "Shop Space",
                      "Office Space",
                    ]}
                    value={values.category}
                    handleChange={handleChange}
                  />
                </div>
                <div className="flex gap-2">
                  <FormTextField
                    label="Area (sq ft)"
                    name="area"
                    value={values.area}
                    handleChange={handleChange}
                  />
                  <FormTextField
                    label="Floors"
                    name="floors"
                    value={values.floors}
                    handleChange={handleChange}
                  />
                  <FormSelectField
                    label="Facing"
                    name="facing"
                    options={[
                      "North",
                      "South",
                      "East",
                      "West",
                      "North-East",
                      "North-West",
                      "South-East",
                      "South-West",
                    ]}
                    value={values.facing}
                    handleChange={handleChange}
                  />
                </div>
              </div>
              {/* Images */}
              <div className="space-y-3">
                <h5 className="font-semibold text-blue-900 flex items-center gap-1">
                  <PermMediaIcon fontSize="small" /> Property Images
                </h5>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex flex-wrap gap-2">{previewImage()}</div>
              </div>
              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  className="rounded-lg py-3 text-lg font-semibold shadow-md bg-blue-900 hover:bg-blue-800 text-white transition-colors"
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Post Property"}
                </Button>
              </div>
              {/* Alert */}
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