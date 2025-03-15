import React from "react";

const RadioButton = ({ options, name, value, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <label key={option} style={{ display: "block" }}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
            required
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
