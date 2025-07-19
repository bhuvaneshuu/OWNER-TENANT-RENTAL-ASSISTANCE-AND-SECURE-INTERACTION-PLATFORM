import { useCallback, useState } from "react";
import { Logo, NavBarLinksOwner, NavBarLinksTenant } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { Button, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const { userType, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logOut());
    handleMenuClose();
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-[#0a1633] shadow-md sticky top-0 z-20">
      {/* Left: Logo, System Name, and Subtitle */}
      <div className="flex items-center gap-3">
        <Logo />
        <div className="flex flex-col ml-2">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Owner-Tenant System
          </span>
          <span className="text-sm font-medium text-white">
            Effortless property handling for owners & tenants
          </span>
        </div>
      </div>
      {/* Right: Nav Links, Profile Picture, Hamburger */}
      <div className="flex items-center gap-4">
        {/* Nav links (hidden on mobile) */}
        <nav className="hidden lg:flex gap-6">
          {userType === "owner" ? (
            <NavBarLinksOwner
              toggleMenu={() => {}}
              linkClassName="text-white font-medium hover:text-blue-300 transition px-2 py-1"
            />
          ) : (
            <NavBarLinksTenant
              toggleMenu={() => {}}
              linkClassName="text-white font-medium hover:text-blue-300 transition px-2 py-1"
            />
          )}
        </nav>
        {/* Hamburger menu for mobile only */}
        <IconButton
          className="block lg:hidden"
          onClick={toggleDrawer}
          sx={{ color: "white", display: { lg: "none", xs: "block" } }}
        >
          <MenuIcon />
        </IconButton>
        {/* Profile Picture with dropdown */}
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar
            alt={user?.firstName?.toUpperCase()}
            src={user?.profileImage}
            sx={{ width: 40, height: 40, border: "2px solid #fff" }}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem component={Link} to={`/${userType}/profile`} onClick={handleMenuClose}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </div>
      {/* Drawer for mobile nav (only show if open) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-end lg:hidden" onClick={toggleDrawer}>
          <div className="bg-[#0a1633] h-full w-64 p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            {userType === "owner" ? (
              <NavBarLinksOwner
                toggleMenu={toggleDrawer}
                linkClassName="text-white font-medium hover:text-blue-300 transition px-2 py-1"
              />
            ) : (
              <NavBarLinksTenant
                toggleMenu={toggleDrawer}
                linkClassName="text-white font-medium hover:text-blue-300 transition px-2 py-1"
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
