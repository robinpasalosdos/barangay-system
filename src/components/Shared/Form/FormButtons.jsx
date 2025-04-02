import React, { useContext } from "react";
import { MainContext } from '../../../context/MainContext';

const FormButtons = ({ isEditing, onClose, onSubmit}) => {
  const { user } = useContext(MainContext);
  return (
    <div>
      {isEditing ? (
        <>
          {user && user.editUSerAction && (
            <button id="updateDataBtn" className="blue" onClick={onSubmit}>UPDATE</button>
          )}
          {user && user.prinUSerAction && (
            <button className="purple">PRINT</button>
          )}
          {user && user.deleteUSerAction && (
            <button className="red">DELETE</button>
          )}
          <button className="red" onClick={onClose}>CANCEL</button>
        </>
      ) : (
        <>
        {user && user.addUSerAction && (
          <button id="createDataBtn" className="blue" onClick={onSubmit}>SAVE</button>
        )}
        {user && user.printUSerAction && (
          <button id="saveAndPrint" className="purple">SAVE AND PRINT</button>
        )}
          <button type="button" className="purple" onClick={onClose}>CANCEL</button>
        </>
      )}
    </div>
  );
};

export default FormButtons;