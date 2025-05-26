import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const usePoliceClearanceForm = (
  initialFormState,
  selectedData,
  isEditing,
  addOrUpdateRecord,
  setIsModalOpen,
  setSelectedData,
  image,
  setImage,
  setIsFaceCaptureVisible,
  isFaceChanged,
  setIsFaceChanged,
  setIsLeftFingerprintVisible,
  setIsRightFingerprintVisible,
  setFingerprints
) => {
  const [formState, setFormState] = useState(initialFormState);

  // Open face capture modal
  const handleOpenFaceCapture = () => {
    setIsFaceCaptureVisible(true);
    setIsFaceChanged(true);
    setImage(null);
  };

  // Open fingerprint capture modals
  const handleOpenRightFingerprintCapture = () => setIsRightFingerprintVisible(true);
  const handleOpenLeftFingerprintCapture = () => setIsLeftFingerprintVisible(true);

  // Populate form fields when `selectedData` changes
  useEffect(() => {
    if (isEditing && selectedData) {
      setFormState(selectedData);
      const { data } = supabase.storage
        .from("barangay-clearance-images") // Replace with your bucket name
        .getPublicUrl('public/' +  selectedData.faceFileName);

      const publicUrl = data?.publicUrl || `/assets/faces/placeholder.jpg`; // Fallback to placeholder if no URL
      console.log("Public URL:", publicUrl);

      setImage(publicUrl);
      setFingerprints({
        "left-thumb": "/assets/fingerprint/thumb.jpg",
        "left-index": "/assets/fingerprint/index.jpg",
        "left-middle": "/assets/fingerprint/middle.jpg",
        "left-ring": "/assets/fingerprint/ring.jpg",
        "left-pinky": "/assets/fingerprint/pinky.jpg",
        "right-thumb": "/assets/fingerprint/thumb.jpg",
        "right-index": "/assets/fingerprint/index.jpg",
        "right-middle": "/assets/fingerprint/middle.jpg",
        "right-ring": "/assets/fingerprint/ring.jpg",
        "right-pinky": "/assets/fingerprint/pinky.jpg",
      });
    } else {
      setFormState(initialFormState);
      setImage(`/assets/faces/placeholder.jpg`);
    }
  }, [isEditing, selectedData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Save image to Supabase
  const handleSaveImage = async () => {
    if (!isFaceChanged) return formState.faceFileName || "placeholder.jpg";

    if (!image || !image.startsWith("data:image/")) {
      alert("Invalid image data.");
      return null;
    }

    try {
      const response = await window.api.savePoliceClearanceImage(image);
      if (!response || !response.publicUrl) throw new Error("Upload failed or bad response.");

      const fileName = response.publicUrl.split("/").pop();
      setFormState((prev) => ({ ...prev, faceFileName: fileName }));
      return fileName;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload. Please try again.");
      return null;
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedData(null);
    setIsFaceChanged(false);
    if (!isEditing) setImage(`/assets/faces/placeholder.jpg`);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const fileName = await handleSaveImage();
      const record = { ...formState, faceFileName: fileName };

      if (isEditing) record.id = selectedData?.id;
      else delete record.id;

      await addOrUpdateRecord(record);
      resetForm();
      setIsModalOpen(false);
      setFingerprints({});
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
    setFingerprints({});
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
    handleOpenRightFingerprintCapture,
    handleOpenLeftFingerprintCapture,
  };
};

export default usePoliceClearanceForm;