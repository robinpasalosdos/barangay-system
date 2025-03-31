import { useState, useEffect } from "react";

const useForm = (
  initialFormState,
  selectedData,
  isEditing,
  addOrUpdateRecord,
  setIsModalOpen,
  setSelectedData,
  image,
  setImage,
  setFaceCaptureVisible,
  isFaceChanged,
  setIsFaceChanged
) => {
  const [formState, setFormState] = useState(initialFormState);

  // Open face capture modal
  const handleOpenFaceCapture = () => {
    setFaceCaptureVisible(true);
    setIsFaceChanged(true); // Set the flag to true when the modal is opened
    setImage(null);
  };

  // Populate form fields when `selectedData` changes
  useEffect(() => {
    if (isEditing && selectedData) {
      setFormState(selectedData); // Load the selected record into the form state

      // Set the image to the saved image path
      const savedImagePath = `/assets/faces/${selectedData.faceFileName}`;
      setImage(savedImagePath);
    } else {
      // Reset to placeholder image for new records
      setFormState(initialFormState);
      setImage(`/assets/faces/placeholder.jpg`);
    }
  }, [isEditing, selectedData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveImage = async () => {
    // Skip saving the image if the photo modal was not opened
    if (!isFaceChanged) {
      console.log("Photo modal was not opened. Skipping image save.");
      return formState.faceFileName || "placeholder.jpg"; // Return the existing or placeholder file name
    }

    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      console.error("Invalid image data:", image);
      alert("Invalid image data. Please capture or upload a valid image.");
      return null;
    }

    try {
      // Delete the old image if it exists and is not the placeholder
      // Save the new image
      const response = await window.api.savePoliceClearanceImage(image);

      if (!response || !response.filePath) {
        throw new Error("Invalid response from saveImage");
      }

      const fileName = response.filePath.split("\\").pop(); // Extract the file name

      setFormState((prev) => ({
        ...prev,
        faceFileName: fileName,
      }));

      return fileName;
    } catch (error) {
      console.error("Error saving image:", error);
      return null;
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedData(null); // Clear selected data
    setIsFaceChanged(false); // Reset the photo modal flag
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Save the image and get the file name
      const fileName = await handleSaveImage();

      // Prepare the record for submission
      const record = {
        ...formState,
        faceFileName: fileName, // Include the updated faceFileName
        id: selectedData?.id, // Include the id for updating
      };

      if (isEditing) {
        console.log("Updating record:", record);
      } else {
        console.log("Adding new record:", record);
      }

      // Save the record to the database
      await addOrUpdateRecord(record);

      // Reset the form and close the modal
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm(); // Reset the form fields
    setIsModalOpen(false); // Close the modal
  };

  // Calculate age based on birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "";
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  // Handle birthdate blur to calculate age
  const handleBirthdateBlur = () => {
    const age = calculateAge(formState.birthdate);
    setFormState((prev) => ({ ...prev, age }));
  };

  return {
    formState,
    setFormState,
    handleChange,
    handleSubmit,
    resetForm,
    handleCancel,
    handleBirthdateBlur,
    handleOpenFaceCapture,
    image,
    setImage,
  };
};

export default useForm;