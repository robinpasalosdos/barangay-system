import React, { useContext } from "react";
import { MainContext } from '../../../context/MainContext';

const ActionButtons = ({ record, featureName, handleManage, deleteRecord }) => {
  const handlePrint = () => {
    window.api.printRecord(record);
  };
  const { user } = useContext(MainContext);
  const isUser = record.username === user.username || record.username === "admin";
  return (
    <>
      <button className="blue" onClick={() => handleManage(record)} disabled={isUser}>
        Manage
      </button>
      {user && user.deleteUSerAction && (
        <button className="red" onClick={() => deleteRecord(record.id)} disabled={isUser}>
          Delete
        </button>
      )}
      {featureName === "Police Clearance" && (
        <button className="blue" onClick={handlePrint}>
          Print
        </button>
      )}
    </>
  );
};

export default ActionButtons;