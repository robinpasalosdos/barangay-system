import React, { useContext, useState, useEffect } from "react";
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
import NotificationProvider from "./Notification"; // Import react-hot-toast Toaster
import { toast } from "react-hot-toast";
import "./App.css";

const App = () => {
    return (
        <MainProvider>
            <NotificationProvider />
            <AppContent />
        </MainProvider>
    );
};

const AppContent = () => {
    const { isLoggedIn } = useContext(MainContext);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Listen for online/offline events
    useEffect(() => {
        const handleConnectionChange = () => {
            if (navigator.onLine) {
                toast.success("You are back online. All features are now available.");
            } else {
                toast.error("You are offline. Some features may not work.");
            }
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", handleConnectionChange);
        window.addEventListener("offline", handleConnectionChange);

        return () => {
            window.removeEventListener("online", handleConnectionChange);
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, []);

    return (
        <>
            {!isLoggedIn ? <Login /> : (
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
            )}
        </>
    );
};

export default App;
