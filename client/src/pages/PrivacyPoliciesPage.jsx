import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import { Link } from "react-router-dom";
import privacy1 from "../assets/images/about1.svg";
import privacy2 from "../assets/images/about2.svg";

const PrivacyComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-10 px-4 overflow-x-hidden">
      <h2 className="font-heading font-extrabold text-4xl text-[#223981] text-left uppercase mb-8 tracking-wide drop-shadow-lg ml-2 animate-fadein-delay">Privacy Policies</h2>
      <div className="max-w-5xl mx-auto">
        {/* Introduction: full width */}
        <div className="mb-12 animate-fadein-slideup">
          <p className="text-lg text-gray-700">
            This application collects, uses and shares personal data in accordance with privacy laws to make sure your data protection rights are implemented and enforced. This Privacy Policy sets forth the basic rules and principles by which we process your personal data, and mentions our responsibilities while processing personal data.
          </p>
        </div>
        {/* Data Collection: two columns with image */}
        <div className="mb-16 animate-fadein-slideup delay-100 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="font-bold text-2xl text-[#1976d2] mb-2">Data Collection</h4>
            <p className="text-gray-700 text-lg">
              We collect personal information such as name, email address, phone number, and property details to provide services to our users.
            </p>
          </div>
          <img src={privacy2} alt="Data Collection" className="w-64 max-w-full rounded-xl shadow-md animate-fadein-slideup delay-200 mx-auto" />
        </div>
        {/* All other sections: full width, no image */}
        <div className="mb-12 animate-fadein-slideup delay-200">
          <h4 className="font-bold text-2xl text-[#1976d2] mb-2">Use of Data</h4>
          <p className="text-gray-700 text-lg">
            The collected data will only be used to provide services to our users such as managing their properties and contacting potential tenants.
          </p>
        </div>
        <div className="mb-12 animate-fadein-slideup delay-300">
          <h4 className="font-bold text-2xl text-[#1976d2] mb-2">Security</h4>
          <p className="text-gray-700 text-lg">
            We take security measures to protect the collected data from unauthorized access, disclosure, or modification.
          </p>
        </div>
        <div className="mb-12 animate-fadein-slideup delay-400">
          <h4 className="font-bold text-2xl text-[#1976d2] mb-2">Data Sharing</h4>
          <p className="text-gray-700 text-lg">
            We do not share any personal information with third parties without the user's explicit consent.
          </p>
        </div>
        <div className="mb-12 animate-fadein-slideup delay-500">
          <h4 className="font-bold text-2xl text-[#1976d2] mb-2">Data Retention</h4>
          <p className="text-gray-700 text-lg">
            We will retain the collected data for as long as the user is using our services or as required by law.
          </p>
        </div>
        <div className="mb-12 animate-fadein-slideup delay-600">
          <h4 className="font-bold text-2xl text-[#1976d2] mb-2">User Rights</h4>
          <p className="text-gray-700 text-lg">
            The user has the right to access, modify or delete their personal information by contacting us.
          </p>
        </div>
        <div className="mb-12 animate-fadein-slideup delay-700">
          <h4 className="font-bold text-2xl text-[#1976d2] mb-2">Changes to Policy</h4>
          <p className="text-gray-700 text-lg">
            We reserve the right to change this privacy policy at any time. Users will be notified of any changes via email or through our website.
          </p>
        </div>
      </div>
      <style>{`
        .animate-fadein-delay { animation: fadein-delay 1.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-fadein-slideup { animation: fadein-slideup 1s cubic-bezier(.4,0,.2,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        @keyframes fadein-delay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadein-slideup { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const PrivacyPoliciesPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div>
        <header className="flex m-1 shadow-sm">
          <Logo />
          <div className="flex flex-col justify-center ml-2">
            <h5 className="font-display">Rent Manager</h5>
            <p className="hidden text-xs md:block md:text-sm">
              Find and Manage your rentals in one place
            </p>
          </div>
        </header>
        <PrivacyComponent />
      </div>
    );
  }
  return (
    <div>
      <Header />
      <PrivacyComponent />
    </div>
  );
};

export default PrivacyPoliciesPage;
