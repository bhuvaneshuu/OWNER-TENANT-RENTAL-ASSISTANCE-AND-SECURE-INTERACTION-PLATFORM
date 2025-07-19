import { useEffect, useState, useCallback } from "react";
import {
  Logo,
  FormPasswordField,
  FormTextField,
  AlertToast,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAlert,
  loginOwner,
  loginTenant,
  stateClear,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import loginImg from "../assets/images/loginImg.svg";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const {
    user,
    accountStatus,
    success,
    userType,
    errorMsg,
    errorFlag,
    alertType,
    isLoading,
  } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();

  const [values, setFormValues] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);

  useEffect(() => {
    if (success && accountStatus) {
      navigate(`/${userType}`);
    } else if (success && !accountStatus) {
      navigate(`/account-created/${userType}`);
      dispatch(stateClear());
    }
  }, [accountStatus, success, navigate, userType, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;
    const userInfo = {
      email,
      password,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(loginOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(loginTenant({ userInfo }));
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

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const handleFillCredentials = useCallback(() => {
    setFormValues({
      email:
        param.role === "owner"
          ? "test_owner_user@property.com"
          : "test_tenant_user@property.com",
      password: "secret",
    });
  }, []);

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
            <img src={loginImg} className="w-full animate-img-float" alt="login banner" />
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 w-full max-w-md">
            <h3 className="text-2xl font-extrabold text-blue-900 text-center mb-2">Login to your account</h3>
            <FormTextField
              value={values.email}
              name={"email"}
              type={"email"}
              label={"Email"}
              handleChange={handleChange}
              autoFocus={true}
            />
            <FormPasswordField
              value={values.password}
              handleChange={handleChange}
            />
            <div className="self-end">
              <Link
                to={`/forgot-password/${param.role}`}
                className="text-sm text-[#0050e6] font-robotoNormal hover:text-blue-800 transition duration-200 ease-in-out"
              >
                Forgot Password?
              </Link>
            </div>
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
                "Login"
              )}
            </Button>
            <p className="text-sm font-medium mt-2 md:text-base text-center">
              Don't have an account?{' '}
              <Link
                to={`/register/${param.role}`}
                className="text-[#0050e6] hover:text-blue-800 transition duration-200 ease-in-out font-semibold"
              >
                Register
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

export default Login;
