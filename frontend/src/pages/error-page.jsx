import React from "react";
import { MdOutlineErrorOutline } from "react-icons/md";
function ErrorPage() {
  return (
    <div className="error-page" style={{ fontSize: "2rem" }}>
      <MdOutlineErrorOutline className="error-icon" size={100} />
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a
        href="/home
      "
      >
        Go back to the homepage
      </a>
    </div>
  );
}
export default ErrorPage;
