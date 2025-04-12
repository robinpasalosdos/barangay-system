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
    backgroundColor: '#0d1125',
    border: '2px solid #1981ff',
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
    backgroundColor: '#7b61ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const saveButtonStyle = {
    padding: '12px 32px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'block',
    margin: '32px auto 0',
  };

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

      {allCaptured && (
        <button style={saveButtonStyle} onClick={() => setIsFingerprintCaptureVisible(false)}>
          SAVE
        </button>
      )}
      <button style={saveButtonStyle} onClick={() => setIsFingerprintCaptureVisible(false)}>
        CANCEL
      </button>
    </div>
  );
};

export default FingerprintCapture;
