import React from "react";

const SignUpTextField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      className="form-input"
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
    />
  );
};

export default SignUpTextField;
