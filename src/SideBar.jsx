import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from './context/MainContext';

const SideBar = () => {

    const { setIsAuthenticated, user, setUser } = useContext(MainContext);
    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };
    return (
        <div id="sidebar-container">
            <div id="sidebar">
                <h2>BRGYHUB</h2>
                <ul>
                    <li>
                    <div />
                    <Link to="/">Dashboard</Link>
                    </li>
                    {user && user.policeClearance && (
                        <li>
                            <div />
                            <Link to="/police-clearance">Police Clearance</Link>
                        </li>
                    )}
                    {user && user.warrantBooking && (
                        <li>
                            <div />
                            <Link to="/warrant-booking">Warrant Booking</Link>
                        </li>
                    )}
                    {user && user.rogueDirectory && (
                        <li>
                            <div />
                            <Link to="/rogue-directory">Rogue Directory</Link>
                        </li>
                    )}
                    {user && user.userStatus && (
                        <li>
                            <div />
                            <Link to="/user-status">User Management</Link>
                        </li>
                    )}
                </ul>
                <h3>TOOLS</h3>
                <ul>
                    <li>
                        <div />
                        <a>Biometric Search</a>
                    </li>
                    <li>
                        <div />
                        <a>Upload File</a>
                    </li>
                    <li>
                        <div />
                        <a>Download File</a>
                    </li>
                </ul>
                <h3>ACCOUNT PAGES</h3>
                <ul>
                    <li>
                        <div />
                        <a>Profile</a>
                    </li>
                </ul>
                <ul>
                    <li onClick={handleLogout}>
                        <div />
                        <a>Log Out</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;