import React, { useState, useContext } from 'react';
import { WarrantBookingContext } from '../../context';

const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];

const FingerprintCapture = () => {
  const 
      { 
        fingerprints,
        setFingerprints,
        isFingerprintCaptureVisible,
        setIsFingerprintCaptureVisible, 
      } = useContext(WarrantBookingContext);

  const handleCapture = (hand, finger) => {
    const key = `${hand}-${finger}`;
    setFingerprints((prev) => ({
      ...prev,
      [key]: `/assets/fingerprint/${finger}.jpg`,
    }));
  };

  const wrapperStyle = {
    backgroundColor: '#022539',
    border: '1px solid #1C768F',
    padding: '24px',
    borderRadius: '16px',
    color: '#fff',
    width: '700px',
    height: '550px',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
  };

  const boxStyle = {
    width: '100px',
    height: '140px',
    borderRadius: '12px',
    border: '2px solid #444',
    backgroundColor: '#1b1f30',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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

  const saveButtonStyle = {
    padding: '12px 32px',
    backgroundColor: '#FB991C',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'block',
    width: '150px',
    height: '35px',
    fontSize: '11px',
  };

  const btnContainerStyle = {
    display: 'flex',
    width: "250px",
    margin: '0 auto 5px',
    gap: '10px',
  }

  const renderFingerBox = (finger, hand) => {
    const key = `${hand}-${finger}`;
    const image = fingerprints[key];

    return (
      <div key={key} style={{ textAlign: 'center' }}>
        <div style={boxStyle}>
          {image ? (
            <img
              src={image}
              alt={`${hand} ${finger}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <button style={buttonStyle} onClick={() => handleCapture(hand, finger)}>
          {finger.toUpperCase()}
        </button>
      </div>
    );
  };

  const allCaptured = Object.keys(fingerprints).length === 10;

  return isFingerprintCaptureVisible && (
    <div style={wrapperStyle} className='fingerprintModal'>
      <h2 style={{ marginBottom: '16px' }}>Fingerprint</h2>

      {/* Left Hand */}
      <div style={rowStyle}>
        {fingers.map(finger => renderFingerBox(finger, 'left'))}
      </div>

      {/* Right Hand */}
      <div style={rowStyle}>
        {fingers.map(finger => renderFingerBox(finger, 'right'))}
      </div>
      <div style={btnContainerStyle}>

        <button style={saveButtonStyle} onClick={() => setIsFingerprintCaptureVisible(false)}>
          SAVE
        </button>
   
        <button style={saveButtonStyle} onClick={() => setIsFingerprintCaptureVisible(false)}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default FingerprintCapture;
