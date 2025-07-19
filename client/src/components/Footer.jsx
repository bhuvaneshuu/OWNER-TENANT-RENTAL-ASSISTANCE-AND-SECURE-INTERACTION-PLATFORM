import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const { userType } = useSelector((store) => store.auth);
  return (
    <footer className="p-4 bg-[#0a1633] text-white mt-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex gap-4 text-sm">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <span>|</span>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        <span className="block text-xs text-center mt-1">
          &copy; {new Date().getFullYear()} Owner-Tenant System
        </span>
      </div>
    </footer>
  );
};

export default Footer;
