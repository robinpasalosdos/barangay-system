import React, { useContext } from "react";
import { MainContext } from '../../../context/Context';

const ActionButtons = ({ record, handleManage, deleteRecord }) => {
  const { user } = useContext(MainContext);
  const isAdmin = record.username === "admin";
  return (
    <>
      <button className="blue" onClick={() => handleManage(record)} disabled={isAdmin}>
        Manage
      </button>
      {user && user.deleteUSerAction && (
        <button className="red" onClick={() => deleteRecord(record.id)} disabled={isAdmin}>
          Delete
        </button>
      )}
    </>
  );
};

export default ActionButtons;