/**
 * ButtonModal component
 * This component creates a button that can optionally include an icon.
 * Props:
 * - buttonText: The text to be displayed on the button.
 * - icon: A React component for the icon (optional).
 * - style: Inline styles for the button.
 * - action: The action to be performed when the button is clicked.
 * - ...props: Additional props like className, id, etc.
 */
import React from "react";

function ButtonModal({
  buttonText,
  icon: Icon,
  iconSize = 16,
  style,
  action,
  ...props
}) {
  return (
    <button
      onClick={action}
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
  );
}
export default ButtonModal;
