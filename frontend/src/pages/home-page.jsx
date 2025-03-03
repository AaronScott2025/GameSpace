import React from "react";
import { supabase } from "../../client";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };
  return (
    <div>
      <h1>Hello you are log in</h1>
      <button onClick={signOut}>sign Out</button>
    </div>
  );
};

export default HomePage;
