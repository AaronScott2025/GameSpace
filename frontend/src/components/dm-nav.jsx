import { useNavigate } from "react-router-dom";
import "./dm-nav.css"; // Optional: Add styles separately
import { TiMessages } from "react-icons/ti";

/*
Other icon option:
import { MdOutlineInsertComment } from "react-icons/md"; // Change to desired icon

Add to the jsx page u want it in:
import DMButton from "../components/dm-nav";
<DMButton />
*/

const DMButton = () => {
  const navigate = useNavigate();


  return (
    <TiMessages className="dm-button" onClick={() => navigate("/dm-page")} />
  );
};


export default DMButton;