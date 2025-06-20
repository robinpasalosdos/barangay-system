import React, { useState, useRef, useContext } from 'react';
import { ResidentContext } from '../../context';

const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];



const FingerprintCapture = () => {
  const {
    fingerprints,
    setFingerprints,
  } = useContext(ResidentContext);

  const [status, setStatus] = useState('');
  const [scanningKey, setScanningKey] = useState(null); // Track which finger is being scanned
  const sdkRef = useRef(null);
  const acquisitionStartedRef = useRef(false);
  const currentScanKey = useRef(null); // which finger is being scanned

  // Helper to convert b64url to b64 (from app.js)
  const b64UrlTo64 = (input) => {
    let output = input.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0: break;
      case 2: output += "=="; break;
      case 3: output += "="; break;
      default: throw new Error("Illegal base64url string!");
    }
    return output;
  };

  // Start scan for a specific finger
  const handleScanFinger = (hand, finger) => {
    setStatus('');
    const scanKey = `${hand}-${finger}`;
    currentScanKey.current = scanKey;
    setScanningKey(scanKey); // Set the currently scanning finger
    if (!sdkRef.current) {
      // Initialize SDK
      const sdk = new window.Fingerprint.WebApi();
      sdk.onDeviceConnected = () => setStatus('Scan your finger');
      sdk.onDeviceDisconnected = () => setStatus('Device disconnected');
      sdk.onCommunicationFailed = () => setStatus('Communication Failed');
      sdk.onSamplesAcquired = (s) => {
        // Only handle PNG image
        try {
          const samples = JSON.parse(s.samples);
          const b64 = b64UrlTo64(samples[0]);
          setFingerprints((prev) => ({
            ...prev,
            [currentScanKey.current]: `data:image/png;base64,${b64}`,
          }));
          setStatus('Fingerprint captured!');
          setScanningKey(null); // Clear scanning indicator when done
        } catch (e) {
          setStatus('Failed to parse fingerprint image');
          setScanningKey(null); // Clear scanning indicator on error
        }
      };
      sdk.onQualityReported = (e) => {
        // Optionally handle quality
      };
      sdkRef.current = sdk;
    }
    // Start acquisition
    if (!acquisitionStartedRef.current) {
      const sdk = sdkRef.current;
      const SampleFormat = window.Fingerprint.SampleFormat;
      sdk.startAcquisition(SampleFormat.PngImage, "").then(() => {
        acquisitionStartedRef.current = true;
        setStatus('Place your finger on the scanner...');
      }).catch((err) => {
        setStatus(err.message || 'Failed to start acquisition');
      });
    }
  };

  // Optionally, add a stop handler (not per finger, global)
  const handleStopCapture = () => {
    if (sdkRef.current && acquisitionStartedRef.current) {
      sdkRef.current.stopAcquisition().then(() => {
        acquisitionStartedRef.current = false;
        setStatus('Acquisition stopped');
        setScanningKey(null); // Clear scanning indicator when stopped
      });
    }
  };

  // Styles (from FingerprintCapture)
  const wrapperStyle = {
    color: '#fff',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',  
  };

  const boxStyle = {
    width: '90px',
    height: '126px',
    borderRadius: '12px',
    border: '2px solid #444',
    backgroundColor: '#1b1f30',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#1C768F',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '90px',
    height: '28px',
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
  };

  // Render a finger box for a hand/finger
  const renderFingerBox = (finger, hand) => {
    const key = `${hand}-${finger}`;
    const image = fingerprints[key];
    const isScanning = scanningKey === key;
    return (
      <div key={key} style={{ flexDirection: 'column', gap: '10px' }}>
        <div style={boxStyle}>
          {image ? (
            <img
              src={image}
              alt={`${hand} ${finger}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : isScanning ? (
            <span style={{ color: '#FB991C', fontWeight: 'bold', fontSize: '13px' }}>Ready to scan...</span>
          ) : null}
        </div>
        <button style={buttonStyle} onClick={() => handleScanFinger(hand, finger)}>
          {finger.toUpperCase()}
        </button>
      </div>
    );
  };

  return (
    <div style={wrapperStyle} className='resident-fingerprints'>
      <h3>Left Fingerprint</h3>

      <div style={rowStyle}>
        {[...fingers].reverse().map(finger => renderFingerBox(finger, 'left'))}
      </div>
      <h3>Right Fingerprint</h3>

      <div style={rowStyle}>
        {fingers.map(finger => renderFingerBox(finger, 'right'))}
      </div>
    </div>
  );
};

export default FingerprintCapture;
