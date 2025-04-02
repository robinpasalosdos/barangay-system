import React, { useContext } from "react";
import { MainContext } from "../context/MainContext";

const Dashboard = () => {
    const { user } = useContext(MainContext);
    return (
        <div className="content">
            <h1>Welcome, {user.username}!</h1>
        </div>
    );
};

export default Dashboard;