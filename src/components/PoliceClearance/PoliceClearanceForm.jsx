import React, { useContext } from "react";
import '../../App.css';
import { PoliceClearanceContext } from "../../context";
import usePoliceClearanceForm from "../../hooks/usePoliceClearanceForm";
import { MainContext } from "../../context/MainContext";
import Form from "./Form";

const PoliceClearanceForm = () => {
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
    setImage,
    setIsRightFingerprintVisible,
    setIsLeftFingerprintVisible,
    fingerprints,
    setFingerprints
  } = useContext(PoliceClearanceContext);

  const { user } = useContext(MainContext);

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
    faceFileName: "placeholder.jpg",
    onHold: "0",
    user: user.username  
  };

  const {
    formState,
    handleChange,
    handleSubmit,
    handleCancel,
    handleBirthdateBlur,
    handleOpenFaceCapture,
    handleOpenRightFingerprintCapture,
    handleOpenLeftFingerprintCapture,
  } = usePoliceClearanceForm(
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
      isEditing={isEditing}
      handleOpenRightFingerprintCapture={handleOpenRightFingerprintCapture}
      handleOpenLeftFingerprintCapture={handleOpenLeftFingerprintCapture}
      fingerprints={fingerprints}
    />
  );
};

export default PoliceClearanceForm;