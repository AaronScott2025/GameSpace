/**
 * ButtonModal component
 * component that combines a button with a modal form.
 * It allows users to input data and submit it through the modal.
 * This component creates a button that can optionally include an icon.
 * Props:
 * - buttonText: The text to be displayed on the button.
 * - icon: A React component for the icon (optional).
 * - style: Inline styles for the button.
 * - action: The action to be performed when the button is clicked.
 * - inputs: An array of input objects for the modal form.
 *  Each input object should have the following properties:
 *  - label: The label for the input field.
 * - type: The type of the input field (e.g., text, number, etc.).
 * - ...props: Additional props like className, id, etc.
 */
import React, { act } from "react";
import "/src/styles/modal.css"; // Import the CSS file for styling
import { useState } from "react";

function ButtonModal({
  buttonText,
  icon: Icon,
  iconSize = 16,
  style,
  action,
  inputs = [], // Array of input objects { label: string, type: string, name: string }
  onSubmit,
  formClassName,
  modalClassName,
  buttonsClassName,
  closeButtonClassName,
  submitButtonClassName,
  ...props
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleButtonClick = () => {
    setIsModalOpen(true);
    if (action) action();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData); // Call the onSubmit function with form data
    }
    setFormData({}); // Reset form data after submission
    setIsModalOpen(false);
  };

  return (
    <>
      {/** button */}
      <button
        onClick={handleButtonClick} // Open modal on click
        style={{
          display: "flex", // Use flexbox for alignment
          alignItems: "center", // Center icon and text vertically
          ...style, // Spread the passed styles
        }}
        {...props} // Spread other props (like className, id, etc.)
      >
        {Icon && (
          <Icon style={{ marginRight: "8px", fontSize: `${iconSize}px` }} />
        )}{" "}
        {/* Icon with spacing */}
        {buttonText} {/* Button text */}
      </button>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className={modalClassName}>
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{props.title || "Form"}</h2>
            <div className="modal-form-wrapper">
              <form onSubmit={handleFormSubmit} className={formClassName}>
                {inputs.map((input, index) => (
                  <label key={index}>
                    {input.label}
                    {input.type === "textarea" ? (
                      <textarea
                        name={input.name}
                        value={formData[input.name] || ""}
                        onChange={handleInputChange}
                        required={input.required || false}
                        style={{ height: "100px", resize: "horizontal" }}
                      />
                    ) : input.type === "file" ? (
                      <input
                        type="file"
                        name={input.name}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            [input.name]: e.target.files[0], // Store the file object
                          }))
                        }
                        required={input.required || false}
                      />
                    ) : (
                      <input
                        type={input.type || "text"}
                        name={input.name}
                        value={formData[input.name] || ""}
                        onChange={handleInputChange}
                        required={input.required || false}
                      />
                    )}
                  </label>
                ))}
                <div className={buttonsClassName}>
                  <button
                    type="button"
                    className={closeButtonClassName}
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button type="submit" className={submitButtonClassName}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ButtonModal;
