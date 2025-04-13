import React, { useRef, useContext } from "react";
import Webcam from "react-webcam";
import { PoliceClearanceContext } from "../../context";

const PoliceClearanceFaceCapture = ({}) => {
  const 
  { 
    isFaceCaptureVisible,
    setIsFaceCaptureVisible, 
    setIsFaceChanged,
    image, 
    setImage,
    selectedData,
    isEditing
  } = useContext(PoliceClearanceContext);
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

  const handleCancel = () => {
    setIsFaceCaptureVisible(false);
    setIsFaceChanged(false);
    setImage((isEditing && selectedData) ? `/assets/faces/${selectedData.faceFileName}` : "/assets/faces/placeholder.jpg");
  };

  const handleSave = () => {
    setIsFaceCaptureVisible(false);
    setIsFaceChanged(true);
  };

  return (
    <div id="photo-modal">
      {isFaceCaptureVisible && (
        <div>
          <div>
            Face Capture
            <hr />
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
                  style={{ width: "149px", height: "153px", objectFit: "cover", borderRadius: "12px" }}
                />
              )}
            </div>
            <div>
              <div>
                {!image ? (
                  <button className="teal" onClick={handleCapture}>
                    Capture
                  </button>
                ) : (
                  <button className="teal" onClick={handleRetry}>
                    Retry
                  </button>
                )}
              </div>
              <div>
                {image ? (
                  <button className="teal" onClick={handleSave}>
                    Save Image
                  </button>
                ) : (
                  <button className="teal" onClick={handleCancel}>
                    Cancel
                  </button>
                )}    
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceClearanceFaceCapture;