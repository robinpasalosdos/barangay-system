import React, { useContext } from "react";
import { MainContext } from "../context/Context";

const Dashboard = () => {

    const { setIsAuthenticated, user, setUser } = useContext(MainContext);
    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <div className="content">
            <h1>Welcome, {user.username}!</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;