import React, { useState, useContext, useEffect } from 'react';
import { MainContext } from '../../context/MainContext';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        username: 'admin',
        password: '123'
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const { setIsAuthenticated, setUser } = useContext(MainContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const response = await window.api.login({ 
                username: formData.username, 
                password: formData.password 
            });

            if (response.success) {
                const userData = response.user;
                setUser({
                    ...userData,
                    policeClearance: userData.policeClearance === 1,
                    citizenInformation: userData.citizenInformation === 1,
                    warrantBooking: userData.warrantBooking === 1,
                    rogueDirectory: userData.rogueDirectory === 1,
                    userStatus: userData.userStatus === 1,
                    addUSerAction: userData.addUSerAction === 1,
                    deleteUSerAction: userData.deleteUSerAction === 1,
                    printUSerAction: userData.printUSerAction === 1,
                    editUSerAction: userData.editUSerAction === 1,
                    searchUSerAction: userData.searchUSerAction === 1
                });
                setIsAuthenticated(true);
            } else {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
            setMessage(response.message);
        } catch (error) {
            setMessage('Connection error. Please try again.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [formData]);

    return (
        <div className="login-page">
            
            <div className={`login-container ${shake ? 'shake' : ''}`}>
                <div className="login-header">
                    <div className="logo-container">
                        <h1>BRGUIDE</h1>
                        <div className="logo-underline"></div>
                    </div>
                    <p>Welcome back! Please login to your account.</p>
                </div>
                
                <div className="login-form">
                    <div className="input-group">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                        <div className="input-highlight"></div>
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <div className="input-highlight"></div>
                    </div>

                    {message && <div className="message">{message}</div>}

                    <button 
                        className="login-button" 
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        <span className="button-content">
                            {isLoading ? <FaSpinner className="spinner" /> : 'Login'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
