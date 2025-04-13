import React, { useContext } from "react";
import '../../App.css';
import { RogueDirectoryContext } from "../../context";
import useWarrantBookingForm from "../../hooks/useWarrantBookingForm";
import Form from "./Form";

const RogueDirectoryForm = () => {
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
  } = useContext(RogueDirectoryContext);

  const initialFormState = {
    lastName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    age: "",
    nickname: "",
    placeOfBirth: "",
    address: "",
    civilStatus: "",
    gender: "",
    citizenship: "",
    height: "",
    colorOfHair: "",
    complexion: "",
    weight: "",
    colorOfEyes: "",
    identifyingMarks: "",
    ccisNumber: "",
    crimeCommited: "",
    commitedDate: "",
    dateArrested: "",
    timeArrested: "",
    placeArrested: "",
    issuingCourtAndJudge: "",
    placeDetained: "",
    arrestingUnit: "",
    statusOfCase: "",
    sypnosisOfCriminalOffense: ""
  };
  

  const {
    formState,
    handleChange,
    handleSubmit,
    handleCancel,
    handleBirthdateBlur,
    handleOpenFaceCapture,
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
      isEditing={isEditing}
    />
  );
};

export default RogueDirectoryForm;