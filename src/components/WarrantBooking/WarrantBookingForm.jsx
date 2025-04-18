import React, { useContext } from "react";
import '../../App.css';
import { WarrantBookingContext } from "../../context";
import useWarrantBookingForm from "../../hooks/useWarrantBookingForm";
import Form from "./Form";

const WarrantBookingForm = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditing,
    selectedData,
    setSelectedData,
    addOrUpdateRecord,
    isFaceCaptureVisible,
    setIsFaceCaptureVisible,
    setIsFingerprintCaptureVisible,
    isFaceChanged,
    setIsFaceChanged,
    image,
    setImage,
    setActiveStep,
    setIsCaptured,
    fingerprints,
    setFingerprints,
  } = useContext(WarrantBookingContext);

  const initialFormState = {
    lastName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    age: "",
    address: "",
    civilStatus: "",
    gender: "",
    citizenship: "",
    height: "",
    colorOfHair: "",
    complexion: "",
    weight: "",
    colorOfEyes: "",
    fpSyllabus: "",
    ccisNumber: "",
    crimeCommitted: "",
    committedDate: "",
    placeOfCrime: "",
    placeOfInquisition: "",
    remarks: ""
  };
  

  const {
    formState,
    handleChange,
    handleSubmit,
    handleCancel,
    handleBirthdateBlur,
    handleOpenFaceCapture,
    handleOpenFingerprintCapture,
  } = useWarrantBookingForm(
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
  );

  if (!isModalOpen) return null;

  return (
    <Form
      formState={formState}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleBirthdateBlur={handleBirthdateBlur}
      handleOpenFaceCapture={handleOpenFaceCapture}
      isFaceCaptureVisible={isFaceCaptureVisible}
      handleOpenFingerprintCapture={handleOpenFingerprintCapture}
      image={image}
      fingerprints={fingerprints}
      isEditing={isEditing}
    />
  );
};

export default WarrantBookingForm;