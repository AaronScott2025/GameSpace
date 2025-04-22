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
      const { data, error } = await supabase.auth.signUp({
        email: usersData.email,
        password: usersData.password,
      });

      if (error) {
        console.error("Sign up failed", error);
        alert(error.message); // Show error message to the user
        return; // Exit the function if sign-up fails
      }

      const user = data.user;

      if (user) {
        console.log("Sign up successful");

        // Insert user ID and username into the profile table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: user.id,
              username: usersData.username,
              email: usersData.email,
            },
          ]);

        if (profileError) {
          console.error("Profile creation failed", profileError);
          alert("Error: Profile creation failed. Please try again."); // Show profile error
        } else {
          console.log("Profile created", profileData);
          alert(
            "Success: Account successfully created! Redirecting to login..."
          );
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Sign up failed", error);
      alert("Error: An unexpected error occurred. Please try again."); // Show generic error
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
        <form className="signup-form" onSubmit={handleSignUp}>
          <h1 className="form-tittle">Sign Up</h1>

          <SignUpTextField
            className={"signup-username-tf"}
            label="Username"
            type="text"
            name="username"
            placeholder="username"
            value={usersData.username}
            onChange={(e) =>
              setUsersData({ ...usersData, username: e.target.value })
            }
          />
          <SignUpTextField
            className={"signup-email-tf"}
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
            className={"signup-password-tf"}
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
          <FormButton className={"create-account-button"} text={"Sign Up"} />
        </form>
        <h2>Already have an account?</h2>
        <FormButton
          className={"go-to-login-btn"}
          text={"Log In"}
          route={goToLogin}
        />
      </div>
    </div>
  );
};
export default SignupPage;
