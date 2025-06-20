import React, { useRef, useContext } from "react";
import Webcam from "react-webcam";
import { ResidentContext } from "../../context";

const FaceCapture = ({ fullName }) => {
  const 
  {
    image, 
    setImage,
    
  } = useContext(ResidentContext);
  const webcamRef = useRef(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      setImage(capturedImage);
    }
  };

  const handleRetry = () => {
    setImage(null);
  };

  return (
    <div className="face-container">
      <div>
        <div>
          <h2>Face Capture</h2>
        </div>
        <div>
          <div>
            {!image ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                videoConstraints={{ facingMode: "user" }}
                className="face"
              />
            ) : (
              <img
                src={image}
                alt="Captured"
              />
            )}
          </div>
          <div>
            <h3>{fullName || "Unnamed Profile"}</h3>
            <div>
              {!image ? (
                <button className="teal" onClick={handleCapture}>
                  Capture
                </button>
              ) : (
                <button className="teal" onClick={handleRetry}>
                  Open Camera
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;