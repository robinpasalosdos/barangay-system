import React, { useState, useContext, useEffect } from 'react';
import { MainContext } from '../../context/MainContext';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        email: 'robinpasalosdos@gmail.com', // Pre-filled email
        password: 'admin', // Pre-filled password
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const { setisLoggedIn, setUser } = useContext(MainContext);

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
                email: formData.email, 
                password: formData.password 
            });

            if (response.success) {
                const userData = response.user;
                setUser({
                    ...userData,
                    policeClearance: !!userData.police_clearance,
                    citizenInformation: !!userData.citizen_information,
                    warrantBooking: !!userData.warrant_booking,
                    rogueDirectory: !!userData.rogue_directory,
                    userStatus: !!userData.user_status,
                    addUserAction: !!userData.add_user_action,
                    deleteUserAction: !!userData.delete_user_action,
                    printUserAction: !!userData.print_user_action,
                    editUserAction: !!userData.edit_user_action,
                    searchUserAction: !!userData.search_user_action
                });
                setisLoggedIn(true);
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
                            name="email"
                            placeholder="Email"
                            value={formData.email}
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
