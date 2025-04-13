import React, { useRef, useContext } from 'react';
import Webcam from 'react-webcam';
import { WarrantBookingContext } from '../../context';
const steps = ['Front Face', 'Left Face', 'Right Face', 'Whole Body'];

const MugshotCapture = () => {
  const webcamRef = useRef(null);
  const 
    { 
      isFaceCaptureVisible,
      setIsFaceCaptureVisible, 
      image, 
      setImage,
      activeStep,
      setActiveStep,
      setIsCaptured,
      isCaptured
    } = useContext(WarrantBookingContext);
  const capture = () => {
    const video = webcamRef.current.video;
  
    if (!video) return;
  
    // Set the canvas size to match video resolution
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // High-quality export
    const imageSrc = canvas.toDataURL('image/jpeg', 1.0); // 1.0 = max quality
  
    setImage({ ...image, [steps[activeStep]]: imageSrc });
    setIsCaptured(true);
  };  

  const retake = () => {
    setIsCaptured(false);
  };

  const submit = () => {
    const label = steps[activeStep];
    const data = image[label];
  
    // Store current step image if not yet stored (extra safety)
    if (!data && isCaptured) {
      setImage({ ...image, [label]: webcamRef.current.getScreenshot() });
    }
  
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setIsCaptured(false);
    } else {
      setIsFaceCaptureVisible(false);
    }
  };
  const wrapperStyle = {
    backgroundColor: '#022539',
    border: '2px solid #1C768F',
    padding: '24px',
    borderRadius: '12px',
    color: '#fff',
    width: '1000px',
    height: '600px',
  };
  

  const mugshotGridStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  };
  

  const getBoxStyle = (isActive, isBody = false) => ({
    width: isBody ? '240px' : '200px',
    height: isBody ? '400px' : '240px',
    borderRadius: '12px',
    border: `2px solid ${isActive ? '#ffa500' : '#333'}`,
    backgroundColor: '#1b1f30',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  });
  

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  };
  
  const buttonStyle = {
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#1C768F',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100px',
    height: '35px',
    fontSize: '11px',
  };
  
  const captureBtn = {
    ...buttonStyle,
    backgroundColor: '#1C768F',
    color: 'white',
  };
  
  const retryBtn = {
    ...buttonStyle,
    backgroundColor: '#1C768F',
    color: 'white',
  };
  
  const saveBtn = {
    ...buttonStyle,
    backgroundColor: '#1C768F',
    color: 'white',
  };

  const handleReset = () => {
    setImage({});
    setActiveStep(0);
    setIsCaptured(false);
  };

  const handleExit = () => {
    setIsFaceCaptureVisible(false);
  };


  return isFaceCaptureVisible && (
  
    <div style={wrapperStyle} className='mugshotModal'>
      
      <h2 style={{ marginBottom: '16px' }}>Mugshots</h2>

      <div style={mugshotGridStyle}>
        {steps.map((step, index) => (
          <div key={step}>
            <p style={{ fontSize: '14px', marginBottom: '6px' }}>{step}:</p>
            <div style={getBoxStyle(index === activeStep, step === 'Whole Body')}>
              {index === activeStep ? (
                !isCaptured ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={{
                      width: { ideal: 1920 },
                      height: { ideal: 1080 },
                      facingMode: 'user',
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={image[step]}
                    alt={step}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )
              ) : image[step] ? (
                <img
                  src={image[step]}
                  alt={step}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div style={buttonRowStyle}>
        {!isCaptured && (
          <>
            <button style={captureBtn} onClick={capture}>
              CAPTURE
            </button>
            <button style={retryBtn} onClick={handleReset}>
              RESET ALL
            </button>
            <button style={retryBtn} onClick={handleExit}>
              EXIT
            </button>
          </>
        )}
        {isCaptured && (
          <>
            <button style={saveBtn} onClick={submit}>
              SAVE
            </button>
            <button style={retryBtn} onClick={retake}>
              RETRY
            </button>
            <button style={retryBtn} onClick={handleReset}>
              RESET ALL
            </button>
            <button style={retryBtn} onClick={handleExit}>
              EXIT
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MugshotCapture;
