import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
    return (
        <div id="sidebar-container">
            <div id="sidebar">
                <h2>BRGYHUB</h2>
                <ul>
                    <li>
                    <div />
                    <a href="index.html">Dashboard</a>
                    </li>
                    <li>
                    <div />
                    <Link to="/">Police Clearance</Link>
                    </li>
                    <li>
                    <div />
                    <Link to="/user-status">User Status</Link>
                    </li>
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
            </div>
        </div>
    );
};

export default SideBar;