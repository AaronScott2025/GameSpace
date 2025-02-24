import React from "react";

const FormButton = ({ text }) => {
  return (
    <button className="form-button" type="submit">
      {text}
    </button>
  );
};

export default FormButton;
