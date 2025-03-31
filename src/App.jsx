import React from "react";
import { MainProvider } from "./context/Context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PoliceClearance from "./components/PoliceClearance/PoliceClearance";
import UserStatus from "./components/UserStatus/UserStatus";
import SideBar from "./SideBar";
import "./App.css";

const App = () => {
    return (
        <MainProvider>
            <Router>
                <div className="main-container">
                    <SideBar />
                    <Routes>
                        <Route path="/" element={<PoliceClearance />} />
                        <Route path="/user-status" element={<UserStatus />} />
                        {/* <Route path="/police-clearance" element={<PoliceClearanceTable />} /> */}
                    </Routes>
                </div>
            </Router>
        </MainProvider>
    );
};

export default App;
