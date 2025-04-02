import React, { useContext } from "react";
import CheckBox from "../Shared/Form/CheckBox";
import InputField from "../Shared/Form/InputField";
import { UserStatusContext } from "../../context";
import { MainContext } from "../../context/MainContext";
import useForm from "../../hooks/useUserStatusForm";

const UserForm = () => {
  const 
  { 
    isModalOpen,
    setIsModalOpen,
    isEditing,
    selectedData,
    setSelectedData,
    addOrUpdateRecord,
  } = useContext(UserStatusContext);

  const {
    user,
    setUser
  } = useContext(MainContext);

  const initialFormState = {
    username: "",
    password: "",
    policeClearance: false,
    citizenInformation: false,
    warrantBooking: false,
    rogueDirectory: false,
    userStatus: false,
    addUSerAction: false,
    deleteUSerAction: false,
    printUSerAction: false,
    editUSerAction: false,
    searchUSerAction: false,
  }
  
  const { setFormState, formState, handleChange, handleSubmit, handleCancel } = useForm(
    initialFormState, selectedData, isEditing, addOrUpdateRecord, setIsModalOpen, setSelectedData, setUser, user
  );
  

  if (!isModalOpen) return null;

  return (
    <div className="user-status-form">
      <h2>{isEditing ? "Edit User" : "Add User"}</h2>
      <div>
        <InputField
          id="username"
          name="username"
          label="User Name"
          value={formState.username || ""}
          onChange={handleChange}
          placeholder="Enter user name"
        />

        <InputField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formState.password || ""}
          onChange={handleChange}
          placeholder="Enter password"
        />
      </div>
      <div>
        <CheckBox
          id="policeClearance"
          name="policeClearance"
          label="Police Clearance"
          checked={formState.policeClearance}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="citizenInformation"
          name="citizenInformation"
          label="Citizen Information"
          checked={formState.citizenInformation}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="warrantBooking"
          name="warrantBooking"
          label="Warrant Booking"
          checked={formState.warrantBooking}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="rogueDirectory"
          name="rogueDirectory"
          label="Rogue Directory"
          checked={formState.rogueDirectory}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="userStatus"
          name="userStatus"
          label="User Status"
          checked={formState.userStatus}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="addUSerAction"
          name="addUSerAction"
          label="Add"
          checked={formState.addUSerAction}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="deleteUSerAction"
          name="deleteUSerAction"
          label="Delete"
          checked={formState.deleteUSerAction}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="printUSerAction"
          name="printUSerAction"
          label="Print"
          checked={formState.printUSerAction}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="editUSerAction"
          name="editUSerAction"
          label="Edit"
          checked={formState.editUSerAction}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
        <CheckBox
          id="searchUSerAction"
          name="searchUSerAction"
          label="Search"
          checked={formState.searchUSerAction}
          onChange={(id, checked) =>
            setFormState((prev) => ({ ...prev, [id]: checked }))
          }
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <button type="submit" className="submit-button blue" onClick={handleSubmit}>
        Submit
      </button>
      <button
        type="button"
        className="cancel-button red"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default UserForm;