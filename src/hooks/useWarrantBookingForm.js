import { useState, useEffect } from "react";

const useWarrantBookingForm = (
  initialFormState,
  selectedData,
  isEditing,
  addOrUpdateRecord,
  setIsModalOpen,
  setSelectedData,
  image,
  setImage,
  setIsFaceCaptureVisible,
  setIsFingerprintCaptureVisible,
  isFaceChanged,
  setIsFaceChanged,
  setActiveStep,
  setIsCaptured,
  fingerprints,
  setFingerprints,
) => {
  const [formState, setFormState] = useState(initialFormState);

  const handleOpenFaceCapture = () => {
    setIsFaceCaptureVisible(true);
  };

  const handleOpenFingerprintCapture = () => {
    setIsFingerprintCaptureVisible(true);
  };

  useEffect(() => {
    if (isEditing && selectedData) {
      setFormState(selectedData);
      const savedImagePath = 
      {
        "Front Face": `/assets/mugshots/${selectedData.lastName}/front_face.jpg`,
        "Left Face": `/assets/mugshots/${selectedData.lastName}/left_face.jpg`,
        "Right Face": `/assets/mugshots/${selectedData.lastName}/right_face.jpg`,
        "Whole Body": `/assets/mugshots/${selectedData.lastName}/whole_body.jpg`,
      };
      const savedFingerprintPath = {
        'left-thumb': '/assets/fingerprint/thumb.jpg',
        'left-index': '/assets/fingerprint/index.jpg',
        'left-middle': '/assets/fingerprint/middle.jpg',
        'left-ring': '/assets/fingerprint/ring.jpg',
        'left-pinky': '/assets/fingerprint/pinky.jpg',
        'right-thumb': '/assets/fingerprint/thumb.jpg',
        'right-index': '/assets/fingerprint/index.jpg',
        'right-middle': '/assets/fingerprint/middle.jpg',
        'right-ring': '/assets/fingerprint/ring.jpg',
        'right-pinky': '/assets/fingerprint/pinky.jpg',
      };
      setImage(savedImagePath);
      setActiveStep(3);
      setIsCaptured(true);
      setFingerprints(savedFingerprintPath);
    } else {
      setFormState(initialFormState);
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

  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedData(null);
  };

  const handleResetImages = () => {
    setImage({});
    setActiveStep(0);
    setIsCaptured(false);
    setFingerprints({});
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const fileName = await handleSaveImage();

      const record = {
        ...formState,
        faceFileName: fileName,
        id: selectedData?.id,
      };

      if (isEditing) {
        console.log("Updating record:", record);
      } else {
        console.log("Adding new record:", record);
      }

      // Save the record to the database
      await addOrUpdateRecord(record);

      if (window.api?.saveMugshotCaptured) {
        await window.api.saveMugshotCaptured(image, formState.lastName).then((res) => {
          console.log('Saved in:', res.path);
        });
      } else {
        console.warn('No last name provided. Mugshot not saved.');
      }
      resetForm();
      handleResetImages();
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm(); // Reset the form fields
    setIsModalOpen(false);
    handleResetImages();
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
    handleOpenFingerprintCapture,
    image,
    setImage,
  };
};

export default useWarrantBookingForm;