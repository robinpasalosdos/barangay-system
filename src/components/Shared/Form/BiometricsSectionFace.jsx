import React, { useContext } from "react";
import { Context } from "../../../context/Context";

const BiometricsSectionFace = ({ label, buttonText, onButtonClick }) => {
  const { image, isFaceCaptureVisible } = useContext(Context); // Access image from context

  return (
    <div>
      <label>{label}</label>
      <div>
        <div class="image-box face">
        {!isFaceCaptureVisible ? ( // Check if image exists
          <img
            src={image} // Use the Base64 image string as the src
            alt="Captured Face"
            style={{ width: "149px", height: "153px", objectFit: "cover", borderRadius: "12px" }}
          />
        ) : (
          <p>No image available</p>
        )}
        </div>
        <button onClick={onButtonClick} className="biometrics-face-btn yellow">
            {buttonText}
          </button>
      </div>
    </div>
  );
};

export default BiometricsSectionFace;