import { useState, useEffect } from "react";

const useForm = (
  initialFormState,
  selectedData,
  isEditing,
  addOrUpdateRecord,
  setIsModalOpen,
  setSelectedData,
  setUser,
  user
) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isEditing && selectedData) {
      setFormState({
        ...selectedData,
        policeClearance: selectedData.policeClearance === 1,
        citizenInformation: selectedData.citizenInformation === 1,
        warrantBooking: selectedData.warrantBooking === 1,
        rogueDirectory: selectedData.rogueDirectory === 1,
        userStatus: selectedData.userStatus === 1,
        addUSerAction: selectedData.addUSerAction === 1,
        deleteUSerAction: selectedData.deleteUSerAction === 1,
        printUSerAction: selectedData.printUSerAction === 1,
        editUSerAction: selectedData.editUSerAction === 1,
        searchUSerAction: selectedData.searchUSerAction === 1
      });
    } else {
      setFormState(initialFormState);
    }
  }, [isEditing, selectedData]);

  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedData(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const record = {
        ...formState,
        id: selectedData?.id,
      };

      if (isEditing) {
        console.log("Updating user:", record);
      } else {
        console.log("Adding new user:", record);
      }

      await addOrUpdateRecord(record);
      user.username === record.username && setUser(record);
      resetForm();
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return {
    setFormState,
    formState,
    handleChange,
    handleSubmit,
    handleCancel
  };
};

export default useForm;