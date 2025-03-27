import React from "react";
import { BarangayProvider } from "./context/BarangayClearanceContext";
import BarangayClearanceTable from "./components/BarangayClearance/BarangayClearanceTable";
import SideBar from "./SideBar";

const App = () => {
    return (
        <div className="main-container">
            <SideBar />
            <BarangayProvider>
                <BarangayClearanceTable />
            </BarangayProvider>
        </div>
    );
};

export default App;
