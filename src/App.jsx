import React from "react";
import { BarangayProvider } from "./context/BarangayClearanceContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarangayClearanceTable from "./components/BarangayClearance/BarangayClearanceTable";
import PoliceClearanceTable from "./components/PoliceClearance/PoliceClearanceTable";
import SideBar from "./SideBar";
import "./App.css"; // Import your CSS file for styling

const App = () => {
    return (
        <BarangayProvider>
            <Router>
                <div className="main-container">
                    <SideBar />

                        <Routes>
                            <Route path="/" element={<BarangayClearanceTable />} />
                            <Route path="/police-clearance" element={<PoliceClearanceTable />} />
                        </Routes>
         
                </div>
            </Router>
        </BarangayProvider>
    );
};

export default App;
