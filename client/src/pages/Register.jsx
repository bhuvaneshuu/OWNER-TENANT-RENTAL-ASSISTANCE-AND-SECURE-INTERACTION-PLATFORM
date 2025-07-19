import { useEffect, useState, useCallback } from "react";
import {
  Logo,
  FormTextField,
  FormPasswordField,
  FormSelectField,
  AlertToast,
  DatePicker,
  CountrySelectField,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  registerOwner,
  registerTenant,
  clearAlert,
  stateClear,
  createAlert,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import registerImg from "../assets/images/registerImg.svg";
import { Button, CircularProgress } from "@mui/material";
import moment from "moment";
import { ageCalculator } from "../utils/valueFormatter";

const Register = () => {
  const { success, userType, errorFlag, errorMsg, isLoading, alertType } =
    useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      navigate(`/account-created/${userType}`);
      dispatch(stateClear());
    }
  }, [navigate, userType, success, dispatch]);

  const [values, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    phoneNumber: "",
    gender: "",
    password: "",
  });

  const [date, setDate] = useState(null);
  const [image, setImage] = useState(null);
  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const previewImage = () => {
    if (image) {
      return (
        <div className="p-2">
          <img src={image} alt="profilePreview" className="h-24 md:h-28" />
        </div>
      );
    }
  };
  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    formData.append("role", param.role);
    const dob = moment(date).format("YYYY-MM-DD");
    const age = ageCalculator(dob);
    if (age < 18) {
      dispatch(createAlert("You must be 18 years or older to register"));
      return;
    }
    formData.append("dateOfBirth", moment(date).format("YYYY-MM-DD"));
    if (param.role === "owner") {
      dispatch(registerOwner({ formData }));
    } else if (param.role === "tenant") {
      dispatch(registerTenant({ formData }));
    }
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

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-purple-200 via-purple-100 to-white" />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white/80 shadow-md sticky top-0 z-20 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="inline-block animate-logo-pop">
            <Logo />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900 leading-tight tracking-tight drop-shadow-sm">Owner-Tenant System</h1>
            <p className="text-blue-800 text-sm font-medium -mt-1">Effortless property handling for owners & tenants</p>
          </div>
        </div>
        <div></div> {/* Empty for spacing, can add nav if needed */}
      </header>

      <main className="flex-1 flex items-center justify-center px-2 py-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg flex flex-col md:flex-row items-center p-6 md:p-12 gap-8 animate-section-reveal">
          {/* Illustration (hidden on mobile) */}
          <div className="hidden md:block w-1/2">
            <img src={registerImg} className="w-full animate-img-float" alt="register banner" />
          </div>
          {/* Registration Form */}
          <form onSubmit={handleSubmit} id="form" className="flex-1 flex flex-col gap-6 w-full max-w-md">
            <h3 className="text-2xl font-extrabold text-blue-900 text-center mb-2">Register for your new account</h3>
            <FormTextField
              label="First Name"
              name="firstName"
              type={"text"}
              value={values.firstName}
              handleChange={handleChange}
              autoFocus={true}
            />
            <FormTextField
              label="Last Name"
              name="lastName"
              type={"text"}
              value={values.lastName}
              handleChange={handleChange}
            />
            <FormTextField
              label="Email"
              name="email"
              type={"email"}
              value={values.email}
              handleChange={handleChange}
            />
            <FormTextField
              label="Address"
              name="address"
              type={"text"}
              value={values.address}
              handleChange={handleChange}
            />
            <FormTextField
              label="City"
              name="city"
              type={"text"}
              value={values.city}
              handleChange={handleChange}
            />
            <CountrySelectField
              value={values.country}
              setFormValues={setFormValues}
              handleChange={handleChange}
            />
            <FormTextField
              label="Phone Number"
              name="phoneNumber"
              type={"text"}
              value={values.phoneNumber}
              handleChange={handleChange}
            />
            <DatePicker
              value={date}
              label="Date of Birth"
              handleChange={useCallback(
                (date) => {
                  setDate(date);
                },
                [setDate]
              )}
            />
            <FormSelectField
              label="Gender"
              name="gender"
              options={["Male", "Female", "Other"]}
              value={values.gender}
              handleChange={handleChange}
            />
            <div className="flex flex-col justify-center my-2">
              <label
                htmlFor="profileImg"
                className="mb-2 cursor-pointer font-robotoNormal self-center"
              >
                Upload Profile Images
              </label>
              <input
                required
                name="profileImage"
                className="font-robotoNormal w-full px-3 py-1.5 text-base font-normal border border-solid border-gray-300 rounded cursor-pointer focus:border-primary focus:outline-none"
                type="file"
                id="profileImg"
                onChange={handleImageChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                JPG, JPEG, PNG or GIF (MAX 3.5mb per)
              </p>
              <div className="self-center border mt-2">
                {previewImage()}
              </div>
            </div>
            <FormPasswordField
              value={values.password}
              handleChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              disabled={isLoading}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  opacity: [0.9, 0.8, 0.7],
                },
                width: "100%",
              }}
            >
              {isLoading ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                "Register"
              )}
            </Button>
            <p className="text-sm font-medium mt-2 md:text-base text-center">
              Already have an account?{' '}
              <Link
                to={`/login/${param.role}`}
                className="text-[#0050e6] hover:text-blue-800 transition duration-200 ease-in-out font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>
      {/* Footer and Alerts */}
      <footer className="w-full bg-white/80 shadow-inner py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
          <span className="text-blue-900 font-extrabold text-lg tracking-tight">Owner-Tenant System</span>
          <span className="text-blue-800 font-medium text-sm mt-1">Effortless property handling for owners & tenants</span>
          <span className="text-gray-500 text-xs mt-2">&copy; {new Date().getFullYear()} Owner-Tenant System. All rights reserved.</span>
        </div>
      </footer>
      <AlertToast
        alertFlag={errorFlag}
        alertMsg={errorMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
      {/* Custom Animations */}
      <style>
        {`
        @keyframes bg-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-bg-gradient {
          background-size: 200% 200%;
          animation: bg-gradient 12s ease-in-out infinite;
        }
        @keyframes logo-pop {
          0% { transform: scale(0.7); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-logo-pop {
          animation: logo-pop 1s cubic-bezier(.77,0,.18,1);
        }
        @keyframes img-float {
          0% { opacity: 0; transform: translateY(40px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-img-float {
          animation: img-float 1.2s cubic-bezier(.77,0,.18,1);
        }
        @keyframes section-reveal {
          0% { opacity: 0; transform: translateY(60px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-section-reveal {
          animation: section-reveal 1.2s 0.2s cubic-bezier(.77,0,.18,1) both;
        }
        `}
      </style>
    </div>
  );
};

export default Register;
