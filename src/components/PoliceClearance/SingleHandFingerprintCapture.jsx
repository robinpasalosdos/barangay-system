import React, { useContext } from 'react';
import LeftFingerprintCapture from './LeftFingerprintCapture';
import RightFingerprintCapture from './RightFingerprintCapture';
import { PoliceClearanceContext } from '../../context';
const FingerprintPage = () => {
    const 
        { 
            fingerprints,
            isLeftFingerprintVisible, 
            isRightFingerprintVisible,
            setIsLeftFingerprintVisible,
            setIsRightFingerprintVisible,
            setFingerprints,
        } = useContext(PoliceClearanceContext);

    const handleCapture = (hand, finger) => {
    const key = `${hand}-${finger}`;
    setFingerprints(prev => ({
        ...prev,
        [key]: `/assets/fingerprint/${finger}.jpg`,
    }));
    };

    const btnContainerStyle = {
        display: 'flex',
        width: "250px",
        margin: '0 auto 5px',
        gap: '10px',
      }
    

    return (isLeftFingerprintVisible || isRightFingerprintVisible) && (
    <div style={{ backgroundColor: '#022539', padding: 24, borderRadius: 16, color: '#fff', border: '2px solid #1C768F' }} className='fingerprintModal'>                             
        <h2 style={{ marginBottom: 16 }}>Fingerprint Capture</h2>

        {isLeftFingerprintVisible && (
            <LeftFingerprintCapture fingerprints={fingerprints} onCapture={handleCapture} />
        )}

        {isRightFingerprintVisible && (
            <RightFingerprintCapture fingerprints={fingerprints} onCapture={handleCapture} />
        )}
        <div style={btnContainerStyle}>
        <button
            style={{
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
            }}
            onClick={() => {   
                    setIsLeftFingerprintVisible(false);
                    setIsRightFingerprintVisible(false);
                }}
        >
            SAVE
        </button>
        <button
            style={{
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
            }}
            onClick={() => {   
                    setIsLeftFingerprintVisible(false);
                    setIsRightFingerprintVisible(false);
                }}
        >
            CANCEL
        </button>
        </div>
    </div>
    );
};

    export default FingerprintPage;
