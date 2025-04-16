import { useNavigate, useLocation } from "react-router-dom";
import "./dm-nav.css"; // Optional: Add styles separately
import { TiMessages } from "react-icons/ti";

/*
Other icon option:
import { MdOutlineInsertComment } from "react-icons/md"; // Change to desired icon

Add to the jsx page u want it in:
import DMButton from "../components/dm-nav";
<DMButton />
*/
/**
 * bottom: 5px;
  right: 30px;
  color: #ffffff;
  font-size: 3vw; /* Make the font size relative to the viewport width
   */

const DMButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Check if the current URL is "/partyfinder"
  const isPartyFinder = location.pathname === "/partyfinder";
  // check if url is marketplace
  const isMarketplace = location.pathname === "/marketplace";
  return (
    <TiMessages
      className="dm-button"
      style={
        isPartyFinder
          ? {
              bottom: "5px",
              right: "30px",
              color: "#ffffff",
              fontSize: "3vw",
            }
          : isMarketplace
          ? {
              bottom: "5px",
              right: "60px",
              color: "#ffffff",
              fontSize: "3vw",
            }
          : {}
      }
      onClick={() => navigate("/dm-page")}
    />
  );
};

export default DMButton;
