import React from "react";

const SignUpTextField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <input
      className={className}
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
