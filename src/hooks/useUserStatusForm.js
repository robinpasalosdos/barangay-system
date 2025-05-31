import { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Import toast for notifications

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
      if (!isEditing && !selectedData) {
        const requiredFields = [
          { name: "email", label: "Email" },
          { name: "username", label: "Username" },
          { name: "password", label: "Password" },
          { name: "confirmPassword", label: "Confirm Password" },
        ];

        for (const field of requiredFields) {
          if (!formState[field.name] && (!isEditing)) {
            toast.error(`${field.label} is required.`);
            return; // Stop submission if a field is empty
          }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formState.email)) {
          toast.error("Please enter a valid email address.");
          return;
        }

        // Validate username length
        if (formState.username.length < 3) {
          toast.error("Username must be at least 3 characters long.");
          return;
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formState.password)) {
          toast.error(
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
          );
          return;
        }

        // Validate passwords match
        if (!isEditing && formState.password !== formState.confirmPassword) {
          toast.error("Passwords do not match. Please try again.");
          return;
        }
      }

      // Exclude confirmPassword before sending the record
      const { confirmPassword, ...record } = formState;

      // Add additional fields if necessary
      record.id = selectedData?.id;
      record.user_id = selectedData?.user_id;

      if (isEditing) {
        console.log("Updating user:", record);
      } else {
        console.log("Adding new user:", record);
      }

      // Call the addOrUpdateRecord function
      await addOrUpdateRecord(record);

      // Update the user state if the username matches
      if (user.username === record.username) {
        setUser(record);
      }

      // Notify success
      toast.success(
        isEditing
          ? "User updated successfully."
          : "User added successfully."
      );

      // Reset the form and close the modal
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      // Log and handle errors
      console.error("Error submitting the form:", error);
      toast.error(error.message || "An unknown error occurred.");
    }
  };

  return {
    setFormState,
    formState,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};

export default useForm;