import React from "react";

function Tags({ tagText }) {
  return (
    <div className="tags-container">
      <span className="tags">{tagText}</span>
    </div>
  );
}

export default Tags;
