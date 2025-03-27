import React from "react";

const BiometricsSectionFinger = ({ label, buttonText, onClick }) => (
  <div>
    <label>{label}</label>
    <div>
      <div className="image-box" />
      <button className="biometrics-finger-btn yellow" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </div>
);

export default BiometricsSectionFinger;