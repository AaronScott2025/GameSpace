import React from "react";
import Navbar from "./nav-bar";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/"];
  return (
    <div className="layout">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
