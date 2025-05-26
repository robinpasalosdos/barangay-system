import React, { useContext } from "react";
import { MainContext } from '../../../context/MainContext';

const FormButtons = ({ isEditing, onClose, onSubmit}) => {
  const { user } = useContext(MainContext);
  return (
    <div>
      {isEditing ? (
        <>
          {user && user.editUserAction && (
            <button id="updateDataBtn" className="yellow" onClick={onSubmit}>UPDATE</button>
          )}
          {user && user.prinUserAction && (
            <button className="yellow">PRINT</button>
          )}
          {user && user.deleteUserAction && (
            <button className="red">DELETE</button>
          )}
          <button className="teal" onClick={onClose}>CANCEL</button>
        </>
      ) : (
        <>
        {user && user.addUserAction && (
          <button id="createDataBtn" className="yellow" onClick={onSubmit}>SAVE</button>
        )}
        {user && user.printUserAction && (
          <button id="saveAndPrint" className="yellow">SAVE AND PRINT</button>
        )}
          <button type="button" className="teal" onClick={onClose}>CANCEL</button>
        </>
      )}
    </div>
  );
};

export default FormButtons;