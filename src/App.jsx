import React from "react";
import { Provider } from "./context/Context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PoliceClearanceTable from "./components/PoliceClearance/PoliceClearanceTable";
import SideBar from "./SideBar";
import "./App.css";

const App = () => {
    return (
        <Provider>
            <Router>
                <div className="main-container">
                    <SideBar />
                    <Routes>
                        <Route path="/" element={<PoliceClearanceTable />} />
                        {/* <Route path="/police-clearance" element={<PoliceClearanceTable />} /> */}
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
};

export default App;
