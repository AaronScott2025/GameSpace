import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpTextField from "../components/login-signup-components/sign-up-textfield";
import FormButton from "../components/login-signup-components/form-button";
import "../styles/signup-page.css";
import { supabase } from "../../client";

const SignupPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login"); // Navigate to Login page
  };

  const [usersData, setUsersData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usersData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Sign up successful", data);
        goToLogin();
      } else {
        console.error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  return (
    <div className="layout-container">
      <div className="signup-container">
        <div className="signup-logo-container">
          <img src="/planet.png" alt="Planet" className="planet-logo" />
          <h1 className="logo-text">
            {" "}
            G A M E <br /> S P A C E{" "}
          </h1>
        </div>
      </div>
      {/* end of the logo*/}

      <div className="signup-form-container">
        <form className="form" onSubmit={handleSignUp}>
          <h1 className="form-tittle">Sign Up</h1>
          {/* <SignUpTextField
            label="Username"
            type="text"
            name="username"
            placeholder="username"
            value={usersData.username}
            onChange={(e) =>
              setUsersData({ ...usersData, username: e.target.value })
            }
          /> */}
          <SignUpTextField
            label="Email"
            type="email"
            name="email"
            placeholder="email"
            value={usersData.email}
            onChange={(e) =>
              setUsersData({ ...usersData, email: e.target.value })
            }
          />
          <SignUpTextField
            label="Password"
            type="password"
            name="password"
            placeholder="password"
            value={usersData.password}
            onChange={(e) =>
              setUsersData({ ...usersData, password: e.target.value })
            }
          />
          <h2>Create account </h2>
          <FormButton text={"Sign Up"} />
        </form>
        <h2>Already have an account?</h2>
        <FormButton text={"Log In"} route={goToLogin} />
      </div>
    </div>
  );
};
export default SignupPage;
