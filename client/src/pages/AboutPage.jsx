import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import about1 from "../assets/images/about1.svg";
import about2 from "../assets/images/about2.svg";
import { Link } from "react-router-dom";

const AboutPageComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex flex-col items-center py-10 px-2 overflow-x-hidden">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-10 animate-fadein-scale">
        <h2 className="font-heading font-extrabold text-5xl text-[#223981] text-center uppercase mb-2 tracking-wider drop-shadow-lg animate-fadein-delay">About</h2>
        <div className="text-xl text-gray-700 text-center max-w-2xl mx-auto animate-fadein-slideup delay-100">
          <p>
            <span className="font-bold text-[#1976d2]">Property Plus</span> is a real estate management platform that helps you to find and manage your rentals in one place. You can either register as a property owner or a tenant. The property owner can post their property and manage their tenants. The tenant can find properties to rent.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-12 animate-fadein-slideup delay-200">
          <div className="md:w-1/2 flex flex-col gap-3">
            <h4 className="font-bold text-3xl text-[#1976d2] mb-2 animate-fadein-slideup delay-300">Property Owner</h4>
            <p className="text-gray-700 text-lg animate-fadein-slideup delay-400">
              The Property Owner has various functionalities such as posting and managing their property, creating rental contracts and rent details, managing tenants, registering rent payments, and viewing rental payment history. Additionally, they can send payment notices to their tenants to ensure timely payments.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src={about1} alt="Property Owner" className="max-w-xs md:max-w-sm rounded-xl shadow-md transition-transform duration-300 hover:scale-105 animate-fadein-slideup delay-500" />
          </div>
        </div>
        <div className="h-1 w-24 bg-blue-100 rounded mx-auto my-2 animate-divider-grow delay-600" />
        <div className="flex flex-col md:flex-row items-center gap-12 animate-fadein-slideup delay-700">
          <div className="md:w-1/2 flex justify-center order-2 md:order-1">
            <img src={about2} alt="Tenant" className="max-w-xs md:max-w-sm rounded-xl shadow-md transition-transform duration-300 hover:scale-105 animate-fadein-slideup delay-800" />
          </div>
          <div className="md:w-1/2 flex flex-col gap-3 order-1 md:order-2">
            <h4 className="font-bold text-3xl text-[#1976d2] mb-2 animate-fadein-slideup delay-900">Tenant</h4>
            <p className="text-gray-700 text-lg animate-fadein-slideup delay-1000">
              The Tenant User can find available properties and contact property owners for rental inquiries. They can save properties to view later and view the details of potential properties. Once they agree to rent a property, they can view and sign the rental contract sent to them by the property owner. They can also view the payment details, due dates, payment history and receive payment reminders from the owner.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .animate-fadein-scale { animation: fadein-scale 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fadein-delay { animation: fadein-delay 1.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-fadein-slideup { animation: fadein-slideup 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-divider-grow { animation: divider-grow 1.2s cubic-bezier(.4,0,.2,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1s; }
        @keyframes fadein-scale { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadein-delay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadein-slideup { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes divider-grow { from { width: 0; opacity: 0; } to { width: 6rem; opacity: 1; } }
      `}</style>
    </div>
  );
};

const AboutPage = () => {
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
        <AboutPageComponent />
      </div>
    );
  }
  return (
    <div>
      <Header />
      <AboutPageComponent />
    </div>
  );
};

export default AboutPage;
