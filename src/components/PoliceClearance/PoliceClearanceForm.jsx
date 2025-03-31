import React, { useContext } from "react";
import '../../App.css';
import { PoliceClearanceContext } from "../../context/PoliceClearanceContext";
import useForm from "../../hooks/useForm";
import Form from "../Shared/Form/Form";

const PoliceClearanceForm = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditing,
    selectedData,
    setSelectedData,
    addOrUpdateRecord,
    isFaceCaptureVisible,
    setFaceCaptureVisible,
    isFaceChanged,
    setIsFaceChanged,
    image,
    setImage
  } = useContext(PoliceClearanceContext);

  const initialFormState = {
    barangayClearanceNumber: "",
    documentDate: "",
    orDate: "",
    documentNumber: "",
    lastName: "",
    firstName: "",
    middleName: "",
    birthdate: "",
    birthplace: "",
    age: "",
    address: "",
    civilStatus: "",
    gender: "",
    purpose: "",
    cedulaNumber: "",
    placeIssued: "",
    dateIssued: "",
    tinNumber: "",
    orNumber: "",
    contactNumber: "",
    findings: "",
    faceFileName: "placeholder.jpg"
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
    setFaceCaptureVisible,
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

export default PoliceClearanceForm;