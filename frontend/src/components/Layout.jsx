import React from "react";
import Navbar from "./nav-bar";
import DMButton from "./dm-nav";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/"]; // Add paths where you want to hide the navbar
  const hideDMButtonPaths = ["/login", "/signup", "/dm-page"]; // Add paths where you want to hide the DM button
  return (
    <div className="layout">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      {!hideDMButtonPaths.includes(location.pathname) && <DMButton />}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
