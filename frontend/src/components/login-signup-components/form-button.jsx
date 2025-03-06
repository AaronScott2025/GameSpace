import React from "react";

const FormButton = ({ text, route }) => {
  return (
    <button className="form-button" type="submit" onClick={route}>
      {text}
    </button>
  );
};

export default FormButton;
