import React from "react";
import { motion } from "framer-motion";
import "/src/styles/loading-animation.css";
function LoadingAnimation() {
  return (
    <div className="loading-animation">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <p>Generating...</p>
    </div>
  );
}

export default LoadingAnimation;
