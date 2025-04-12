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

    return (isLeftFingerprintVisible || isRightFingerprintVisible) && (
    <div style={{ backgroundColor: '#0d1125', padding: 24, borderRadius: 16, color: '#fff' }} className='fingerprintModal'>                             
        <h2 style={{ marginBottom: 16 }}>Fingerprint Capture</h2>

        {isLeftFingerprintVisible && (
            <LeftFingerprintCapture fingerprints={fingerprints} onCapture={handleCapture} />
        )}

        {isRightFingerprintVisible && (
            <RightFingerprintCapture fingerprints={fingerprints} onCapture={handleCapture} />
        )}

        <button
            style={{
            padding: '12px 32px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'block',
            margin: '32px auto 0',
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
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'block',
            margin: '32px auto 0',
            }}
            onClick={() => {   
                    setIsLeftFingerprintVisible(false);
                    setIsRightFingerprintVisible(false);
                }}
        >
            CANCEL
        </button>
    </div>
    );
};

    export default FingerprintPage;
