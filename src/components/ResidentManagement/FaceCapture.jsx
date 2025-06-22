import React, { useRef, useContext } from "react";
import Webcam from "react-webcam";
import { ResidentContext } from "../../context";

const FaceCapture = () => {
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
            {!image ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                videoConstraints={{ facingMode: "user" }}
                className="face"
                style={{ cursor: "pointer" }}
                onClick={handleCapture}
                title="Click to capture photo"
              />
            ) : (
              <img
                src={image}
                alt="Captured"
                style={{ cursor: "pointer" }}
                onClick={handleRetry}
                title="Click to retake photo"
              />
              )}
      </div>
    </div>
  );
};

export default FaceCapture;