import React from "react";

const BiometricsSectionFinger = ({ label, buttonText, onClick, fingerprints }) => (
  <div>
    <label>{label}</label>
    <div>
      <div className="image-box">
      {fingerprints ? (
        <img src={fingerprints} alt="fingerprint" />
      ) : (
        <p>No fingerprint captured</p>
      )}
    </div>
      <button className="biometrics-finger-btn yellow" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </div>
);

export default BiometricsSectionFinger;