import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignUpTextField from "../components/login-signup-components/sign-up-textfield";
import FormButton from "../components/login-signup-components/form-button";
const SignupPage = () => {
  const [usersData, setUsersData] = useState({
    username: "",
    email: "",
    password: "",
  });
  return (
    <>
      <form className="form-container">
        <h1 className="form-tittle">Sign Up</h1>
        <SignUpTextField
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

        <h3>Create account</h3>

        <FormButton text="Sign Up" />

        <h3>Already have an account?</h3>
        <FormButton text="Log In" />
      </form>
    </>
  );
};
export default SignupPage;
