import React from 'react';

const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];

const RightFingerprintCapture = ({ fingerprints, onCapture }) => {
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

  const renderFingerBox = (finger) => {
    const key = `right-${finger}`;
    const image = fingerprints[key];

    return (
      <div key={key} style={{ textAlign: 'center' }}>
        <div style={boxStyle}>
          {image ? (
            <img
              src={image}
              alt={key}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <button style={buttonStyle} onClick={() => onCapture('right', finger)}>
          {finger.toUpperCase()}
        </button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
      {fingers.map(renderFingerBox)}
    </div>
  );
};

export default RightFingerprintCapture;
