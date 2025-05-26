import React, { useContext, useState } from "react";
import CheckBox from "../Shared/Form/CheckBox";
import InputField from "../Shared/Form/InputField";
import { UserStatusContext } from "../../context";
import { MainContext } from "../../context/MainContext";
import useForm from "../../hooks/useUserStatusForm";

const UserForm = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditing,
    selectedData,
    setSelectedData,
    addOrUpdateRecord,
  } = useContext(UserStatusContext);

  const { user, setUser } = useContext(MainContext);

  const initialFormState = {
    username: "",
    email: "",
    password: "",
    policeClearance: false,
    citizenInformation: false,
    warrantBooking: false,
    rogueDirectory: false,
    userStatus: false,
    addUserAction: false,
    deleteUserAction: false,
    printUserAction: false,
    editUserAction: false,
    searchUserAction: false,
  };

  const { setFormState, formState, handleChange, handleSubmit, handleCancel } = useForm(
    initialFormState,
    selectedData,
    isEditing,
    addOrUpdateRecord,
    setIsModalOpen,
    setSelectedData,
    setUser,
    user
  );

  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  const handleSubmitClick = async (e) => {
    setIsSubmitting(true); // Set submitting state to true
    await handleSubmit(e); // Call the handleSubmit function
    setIsSubmitting(false); // Reset submitting state after submission
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div className="user-status-form">
        <h2>{isEditing ? "Edit User" : "Add User"}</h2>
        <div>
          <div>
            {!isEditing && (
              <>
                <InputField
                  id="email"
                  name="email"
                  label="Email"
                  value={formState.email || ""}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
                <InputField
                  id="username"
                  name="username"
                  label="Username"
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
                <InputField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formState.confirmPassword || ""}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                />
              </>
            )}
          </div>
          <div>
            <label>Permissions</label>
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
            </div>
            <label>Actions</label>
            <div>
              <CheckBox
                id="addUserAction"
                name="addUserAction"
                label="Add"
                checked={formState.addUserAction}
                onChange={(id, checked) =>
                  setFormState((prev) => ({ ...prev, [id]: checked }))
                }
              />
              <CheckBox
                id="deleteUserAction"
                name="deleteUserAction"
                label="Delete"
                checked={formState.deleteUserAction}
                onChange={(id, checked) =>
                  setFormState((prev) => ({ ...prev, [id]: checked }))
                }
              />
              <CheckBox
                id="printUserAction"
                name="printUserAction"
                label="Print"
                checked={formState.printUserAction}
                onChange={(id, checked) =>
                  setFormState((prev) => ({ ...prev, [id]: checked }))
                }
              />
              <CheckBox
                id="editUserAction"
                name="editUserAction"
                label="Edit"
                checked={formState.editUserAction}
                onChange={(id, checked) =>
                  setFormState((prev) => ({ ...prev, [id]: checked }))
                }
              />
              <CheckBox
                id="searchUserAction"
                name="searchUserAction"
                label="Search"
                checked={formState.searchUserAction}
                onChange={(id, checked) =>
                  setFormState((prev) => ({ ...prev, [id]: checked }))
                }
              />
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="submit-button blue"
            onClick={handleSubmitClick}
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? "Submitting..." : "Submit"} {/* Change button text */}
          </button>
          <button
            type="button"
            className="cancel-button red"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default UserForm;