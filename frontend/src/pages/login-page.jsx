import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpTextField from "../components/login-signup-components/sign-up-textfield";
import FormButton from "../components/login-signup-components/form-button";
import "../styles/signup-page.css";
import { supabase } from "../../client";

const LoginPage = () => {
  const navigate = useNavigate();

  const goToCreateAccount = () => {
    navigate("/signup");
  };

  const [usersData, setUsersData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: usersData.email,
        password: usersData.password,
      });

      if (error) {
        setErrorMessage("Sign in failed: " + error.message); // Set error message
        console.error("Sign in failed", error);
        return; // Exit the function if sign-in fails
      }
      navigate("/home");
    } catch (error) {
      console.error("Sign in failed", error);
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
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="form-tittle">Log In</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
          {/* Conditionally render error message */}
          <SignUpTextField
            className={"login-textfield-email"}
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
            className={"login-textfield-password"}
            label="Password"
            type="password"
            name="password"
            placeholder="password"
            value={usersData.password}
            onChange={(e) =>
              setUsersData({ ...usersData, password: e.target.value })
            }
          />
          <br></br>
          <FormButton className={"login-button"} text={"Log In"} />
        </form>
        <h2>New to GameSpace?</h2>
        <FormButton
          className={"signup-button"}
          text={"Create account"}
          route={goToCreateAccount}
        />
      </div>
    </div>
  );
};

export default LoginPage;
