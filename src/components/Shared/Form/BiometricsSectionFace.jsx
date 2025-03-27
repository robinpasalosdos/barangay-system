import React from "react";

const BiometricsSectionFace = ({ label, buttonText, onButtonClick, canvasId }) => {
  return (
    <div>
      <label>{label}</label>
      <div>
        <input id="face-file-name" style={{ display: "none" }} />
        <div className="image-box face">
          <canvas id={canvasId} />
        </div>
        <button onClick={onButtonClick} className="biometrics-face-btn yellow">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default BiometricsSectionFace;