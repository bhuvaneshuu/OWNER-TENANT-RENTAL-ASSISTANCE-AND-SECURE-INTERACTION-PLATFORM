import { useEffect, useCallback, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Logo, AlertToast, Footer } from "../components";
import landingImg from "../assets/images/landing1.svg";
import landingImg2 from "../assets/images/landing2.svg";
import bannerImg from "../assets/pexels-pixabay-280221.jpg";
import { clearAlert } from "../features/auth/authSlice";

const animatedWords = [
  "Tenant Placement",
  "Transaction",
  "Property ",
  "Plot and Land Monitoring"
];

const ownerWords = [
  "List Properties",
  "Track Payments",
  "Manage Tenants",
  "Get Notifications"
];
const tenantWords = [
  "Browse Properties",
  "Apply Online",
  "Pay Rent",
  "Chat with Owners"
];

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef(null);

  const { user, userType, errorFlag, alertType, errorMsg } = useSelector(
    (store) => store.auth
  );

  // Animation for headline words
  const [wordIndex, setWordIndex] = useState(0);
  const [ownerWordIndex, setOwnerWordIndex] = useState(0);
  const [tenantWordIndex, setTenantWordIndex] = useState(0);

  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [registerMenuOpen, setRegisterMenuOpen] = useState(false);

  const handleLoginMenu = () => {
    setLoginMenuOpen((open) => {
      if (!open) setRegisterMenuOpen(false); // Close Register if opening Login
      return !open;
    });
  };

  const handleRegisterMenu = () => {
    setRegisterMenuOpen((open) => {
      if (!open) setLoginMenuOpen(false); // Close Login if opening Register
      return !open;
    });
  };
  const closeMenus = () => {
    setLoginMenuOpen(false);
    setRegisterMenuOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % animatedWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ownerInterval = setInterval(() => {
      setOwnerWordIndex((prev) => (prev + 1) % ownerWords.length);
    }, 2000);
    return () => clearInterval(ownerInterval);
  }, []);

  useEffect(() => {
    const tenantInterval = setInterval(() => {
      setTenantWordIndex((prev) => (prev + 1) % tenantWords.length);
    }, 2000);
    return () => clearInterval(tenantInterval);
  }, []);

  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.relative')) {
        closeMenus();
      }
    };
    if (loginMenuOpen || registerMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [loginMenuOpen, registerMenuOpen]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") return;
      dispatch(clearAlert());
    },
    [dispatch]
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-[#223981] via-blue-200 to-slate-100" />

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
        <div className="relative flex items-center gap-4">
          {/* Log in Dropdown */}
          <div className="relative">
            <button
              onClick={handleLoginMenu}
              className={`px-6 py-2 rounded-full font-bold transition
                ${loginMenuOpen ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-100'}
              `}
            >
              Log in
            </button>
            {loginMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-50">
                <button
                  onClick={() => { navigate('/login/owner'); closeMenus(); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Owner Log in
                </button>
                <button
                  onClick={() => { navigate('/login/tenant'); closeMenus(); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Tenant Log in
                </button>
              </div>
            )}
          </div>
          {/* Sign up Dropdown */}
          <div className="relative">
            <button
              onClick={handleRegisterMenu}
              className={`px-6 py-2 rounded-full font-semibold transition
                ${registerMenuOpen ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-100 border border-black'}
              `}
            >
              Sign up
            </button>
            {registerMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-50">
                <button
                  onClick={() => { navigate('/register/owner'); closeMenus(); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Owner Sign up
                </button>
                <button
                  onClick={() => { navigate('/register/tenant'); closeMenus(); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Tenant Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Banner Image with Overlayed Animated Headline and Buttons */}
      <div className="w-full relative">
        <img
          src={bannerImg}
          alt="Cityscape banner"
          className="w-full object-cover max-h-96 md:max-h-[32rem] rounded-b-2xl shadow"
        />
        {/* Overlay with animated headline (no black background) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-6 text-center min-h-[2.5em] md:min-h-[3em]">
            Welcome to your&nbsp;
            <span
              key={wordIndex}
              className="text-[#0050e6] font-extrabold transition-all duration-500 animate-word-bounce inline-block drop-shadow-lg"
              style={{ minWidth: '0', whiteSpace: 'nowrap' }}
            >
              {animatedWords[wordIndex]}
            </span>
            &nbsp;Handling Platform
          </h2>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              className="bg-[#0050e6] hover:bg-blue-800 text-white font-bold rounded-xl px-8 py-3 text-lg transition-all duration-200"
              onClick={() => ref.current.scrollIntoView({ behavior: 'smooth' })}
            >
              Let’s get started
            </button>
          </div>
        </div>
      </div>
      {/* Info Bar with Learn More button below the banner */}
      <div className="max-w-6xl mx-auto mt-8 bg-[#19796A] rounded-3xl flex flex-col md:flex-row items-center px-8 py-8 gap-6">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Discover More Features</h3>
          <p className="text-white text-lg md:text-xl">Explore all the tools and benefits our platform offers to help you move forward with confidence.</p>
        </div>
        <div className="flex-shrink-0">
          <button
            className="bg-white text-[#0050e6] font-bold rounded-xl px-8 py-3 text-lg transition-all duration-200 hover:bg-blue-50"
            onClick={() => navigate('/about')}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Owner & Tenant Sections */}
      <main ref={ref} className="w-full max-w-5xl mx-auto flex flex-col gap-10 pb-10">
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Owner Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">
            {/* Replace with your own SVG or image */}
            <img src={landingImg2} alt="Owner" className="w-24 h-24 mb-4" />
            <h3 className="text-2xl font-extrabold text-[#222] mb-2">For Owners</h3>
            <p className="text-gray-700 mb-6">
              Effortlessly manage your properties, track payments, and connect with tenants—all in one place.
            </p>
            <button
              className="border-2 border-[#0050e6] text-[#0050e6] font-bold rounded-xl px-8 py-3 text-lg transition-all duration-200 hover:bg-blue-50"
              onClick={() => navigate('/register/owner')}
            >
              Owner Portal
            </button>
          </div>
          {/* Tenant Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">
            {/* Replace with your own SVG or image */}
            <img src={landingImg} alt="Tenant" className="w-24 h-24 mb-4" />
            <h3 className="text-2xl font-extrabold text-[#222] mb-2">For Tenants</h3>
            <p className="text-gray-700 mb-6">
              Find your next home, manage your rental agreements, and pay rent online with ease and security.
            </p>
            <button
              className="border-2 border-[#0050e6] text-[#0050e6] font-bold rounded-xl px-8 py-3 text-lg transition-all duration-200 hover:bg-blue-50"
              onClick={() => navigate('/register/tenant')}
            >
              Tenant Portal
            </button>
          </div>
        </div>
      </main>

      {/* Footer and Alerts */}
      <footer className="w-full bg-white/80 shadow-inner py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
          <span className="text-blue-900 font-extrabold text-lg tracking-tight">Owner-Tenant System</span>
          <span className="text-blue-800 font-medium text-sm mt-1">Effortless property handling for owners & tenants</span>
          <span className="text-gray-500 text-xs mt-2">&copy; {new Date().getFullYear()} Owner-Tenant System. All rights reserved.</span>
          <div className="w-full flex justify-center mb-6">
          <Link
            to="/privacy"
            className="text-sm text-[#1976d2] underline hover:text-[#115293] transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </div>
        </div>
      </footer>
      <AlertToast
        alertFlag={errorFlag}
        alertMsg={errorMsg}
        alertType={alertType}
        handleClose={handleAlertClose}
      />

      {/* Custom Animations */}
      <style>
        {`
        /* Animated gradient background */
        @keyframes bg-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-bg-gradient {
          background-size: 200% 200%;
          animation: bg-gradient 12s ease-in-out infinite;
        }
        /* Logo pop */
        @keyframes logo-pop {
          0% { transform: scale(0.7); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-logo-pop {
          animation: logo-pop 1s cubic-bezier(.77,0,.18,1);
        }
        /* Headline fade in */
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(.77,0,.18,1);
        }
        .animate-fade-in-delay {
          animation: fade-in 1s 0.3s cubic-bezier(.77,0,.18,1) both;
        }
        .animate-fade-in-delay2 {
          animation: fade-in 1s 0.6s cubic-bezier(.77,0,.18,1) both;
        }
        /* Headline word bounce */
        @keyframes word-bounce {
          0% { opacity: 0; transform: translateY(-40px) scale(0.8);}
          60% { opacity: 1; transform: translateY(10px) scale(1.1);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-word-bounce {
          animation: word-bounce 1s cubic-bezier(.77,0,.18,1);
        }
        /* Button pop */
        @keyframes btn-pop {
          0% { opacity: 0; transform: scale(0.7);}
          80% { opacity: 1; transform: scale(1.1);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-btn-pop {
          animation: btn-pop 1s 0.7s cubic-bezier(.77,0,.18,1) both;
        }
        .animate-btn-pop-delay {
          animation: btn-pop 1s 0.9s cubic-bezier(.77,0,.18,1) both;
        }
        /* Image float */
        @keyframes img-float {
          0% { opacity: 0; transform: translateY(40px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-img-float {
          animation: img-float 1.2s cubic-bezier(.77,0,.18,1);
        }
        /* Section reveal */
        @keyframes section-reveal {
          0% { opacity: 0; transform: translateY(60px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-section-reveal {
          animation: section-reveal 1.2s 0.2s cubic-bezier(.77,0,.18,1) both;
        }
        .animate-section-reveal-delay {
          animation: section-reveal 1.2s 0.5s cubic-bezier(.77,0,.18,1) both;
        }
        `}
      </style>
    </div>
  );
};

export default Landing;
