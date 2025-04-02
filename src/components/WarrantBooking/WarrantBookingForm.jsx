import React, { useContext } from "react";
import '../../App.css';
import { WarrantBookingContext } from "../../context";
import useForm from "../../hooks/usePoliceClearanceForm";
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
    isFaceChanged,
    setIsFaceChanged,
    image,
    setImage
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
  } = useForm(
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
    setIsFaceChanged
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
      image={image}
      clearanceNumberLabel="Barangay Clearance No."
      isEditing={isEditing}
    />
  );
};

export default WarrantBookingForm;