import React from "react";

const FormButton = ({ text, route, className }) => {
  return (
    <button className={className} type="submit" onClick={route}>
      {text}
    </button>
  );
};

export default FormButton;
