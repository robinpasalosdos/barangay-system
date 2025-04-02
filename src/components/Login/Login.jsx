import React, { useState, useContext } from 'react';
import { MainContext } from '../../context/MainContext'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const { setIsAuthenticated, setUser } = useContext(MainContext);

    const handleLogin = async () => {
        const response = await window.api.login({ username, password });
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

        }
        setMessage(response.message);
    };

    return (
        <div className="content">
            <div className='login-container'>
                <h2>Login</h2>
                <div>
                <input
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    
                />
                <input
                    type="password"
                    placeholder="123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button onClick={handleLogin}>Login</button>
                {message && <p>{message}</p>}
            </div>
            
            
        </div>
    );
};

export default Login;
