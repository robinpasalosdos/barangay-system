import React, { useContext } from "react";
import { MainProvider, MainContext } from "./context/MainContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PoliceClearance from "./components/PoliceClearance/PoliceClearance";
import UserStatus from "./components/UserStatus/UserStatus";
import CitizenInformation from "./components/CitizenInformation/CitizenInformation";
import WarrantBooking from "./components/WarrantBooking/WarrantBooking";
import RogueDirectory from "./components/RogueDirectory/RogueDirectory";
import TestComponent from "./components/TestComponent/TestComponent";
import Login from "./components/Login/Login";
import SideBar from "./SideBar";
import Dashboard from "./components/Dashboard";
import "./App.css";

const App = () => {
    return (
        <MainProvider>
            <AppContent />
        </MainProvider>
    );
};

const AppContent = () => {
    const { isAuthenticated } = useContext(MainContext);

    return (
        !isAuthenticated ? <Login /> : (
            <div className="main-container">
                <SideBar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/police-clearance" element={<PoliceClearance />} />
                    <Route path="/citizen-information" element={<CitizenInformation />} />
                    <Route path="/warrant-booking" element={<WarrantBooking />} />
                    <Route path="/rogue-directory" element={<RogueDirectory />} />
                    <Route path="/user-status" element={<UserStatus />} />
                    {/* <Route path="/test-component" element={<TestComponent />} /> */}
                </Routes>
            </div>
        )
    );
};

export default App;
