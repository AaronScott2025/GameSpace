import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpTextField from "../components/login-signup-components/sign-up-textfield";
import FormButton from "../components/login-signup-components/form-button";
import "../styles/signup-page.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home"); // Navigate to Login page
  };

  const goToCreateAccount = () => {
    navigate("/signup");
  };

  const [usersData, setUsersData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usersData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", data);
        goToHome();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
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
        <form className="form" onSubmit={handleLogin}>
          <h1 className="form-tittle">Log In</h1>

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

          <br></br>

          <FormButton text={"Log In"} />
        </form>
        <h2>New to GameSpace?</h2>
        <FormButton text={"Create account"} route={goToCreateAccount} />
      </div>
    </div>
  );
};

export default LoginPage;
