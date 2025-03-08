
import Navbar from "../components/nav-bar";
import React, { useContext } from "react";
import { supabase } from "../../client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const HomePage = () => {
  const navigate = useNavigate();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <Navbar />
      <h1>Welcome to the Home Page!</h1>
      <h1>Hello you are log in</h1>
      <p>{user.bio}</p>
      <p>{user.username}</p>
      <button onClick={signOut}>sign Out</button>
    </div>
  );
};

export default HomePage;
