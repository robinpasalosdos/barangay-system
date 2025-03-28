import React, { useState, useEffect, useContext } from "react";
import '../../App.css';
import { BarangayClearanceContext } from "../../context/BarangayClearanceContext";
import InputField from "../Shared/Form/InputField";
import SelectField from "../Shared/Form/SelectField";
import BiometricsSectionFinger from "../Shared/Form/BiometricsSectionFinger";
import BiometricsSectionFace from "../Shared/Form/BiometricsSectionFace";
import FormButtons from "../Shared/Form/FormButtons";

const BarangayClearanceForm = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditing,
    selectedData,
    setSelectedData,
    addOrUpdateRecord,
    isFaceCaptureVisible,
    setFaceCaptureVisible,
    savedImagePath,
    setSavedImagePath,
    image,
    setImage
  } = useContext(BarangayClearanceContext);

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
  };

  const [formState, setFormState] = useState(initialFormState);
  

  const handleOpenFaceCapture = () => {
    setFaceCaptureVisible(true);
    setImage(false);
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
      setImage(`/assets/faces/placeholder.jpg`);
    }
  }, [isEditing, selectedData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveImage = async () => {
    if (image) {
      try {
        // Delete the old image if it exists and is not the placeholder
        if (formState.faceFileName && formState.faceFileName !== "placeholder.jpg") {
          await window.api.deleteImage(formState.faceFileName);
        }
  
        // Save the new image
        const response = await window.api.saveImage(image);
        const filePath = response.filePath;
  
        // Extract the file name from the saved image path
        const fileName = filePath.split("\\").pop();
  
        // Update the form state with the new file name
        setFormState((prev) => ({
          ...prev,
          faceFileName: fileName,
        }));
  
        return fileName;
      } catch (error) {
        console.error("Error saving image:", error);
        return null;
      }
    }
    return formState.faceFileName || "placeholder.jpg"; // Return the existing file name or placeholder
  };

  // Reset form fields
  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedData(null); // Clear selected data
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

  const handleEdit = (record) => {
    setSelectedData(record); // Set the record to be edited
    setIsEditing(true); // Enable editing mode
    setIsModalOpen(true); // Open the modal
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm(); // Reset the form fields
    setIsModalOpen(false); // Close the modal
  };

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

  const handleBirthdateBlur = () => {
    const age = calculateAge(formState.birthdate);
    setFormState((prev) => ({ ...prev, age }));
  };

  if (!isModalOpen) return null;

  return (
    <div id="modal">
      <div id="id" hidden="" />
      <div className="modal">
        <div>
          <div>
            <div>
              <InputField
                label="Barangay Clearance No."
                id="barangay-clearance-number"
                name="barangayClearanceNumber"
                placeholder="Enter Barangay Clearance No."
                value={formState.barangayClearanceNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="Document Date"
                id="document-date"
                name="documentDate"
                placeholder="Enter Document Date"
                value={formState.documentDate || ""}
                onChange={handleChange}
              />
              <InputField
                label="OR Date"
                id="or-date"
                name="orDate"
                placeholder="Enter OR Date"
                value={formState.orDate || ""}
                onChange={handleChange}
              />
              <InputField
                label="Document Number"
                id="document-number"
                name="documentNumber"
                placeholder="Enter Document Number"
                value={formState.documentNumber || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <div>
                <BiometricsSectionFinger
                  label="Right Finger 1:"
                  buttonText="SCAN" />
                <BiometricsSectionFinger
                  label="Left Finger 2:"
                  buttonText="SCAN" />
                <BiometricsSectionFace
                  label="Face 3:"
                  buttonText={!isFaceCaptureVisible && image ? "CHANGE" : "SUBMIT"} // Dynamically set button text
                  onButtonClick={handleOpenFaceCapture}
                  savedImagePath={!isFaceCaptureVisible || image}
                />
              </div>
            </div>
          </div>
          <div>
            <div>
              <InputField
                label="Last Name"
                id="last-name"
                name="lastName"
                placeholder="Enter Last Name"
                value={formState.lastName || ""}
                onChange={handleChange}
              />
              <InputField
                label="First Name"
                id="first-name"
                name="firstName"
                placeholder="Enter First Name"
                value={formState.firstName || ""}
                onChange={handleChange}
              />
              <InputField
                label="Middle Name"
                id="middle-name"
                name="middleName"
                placeholder="Enter Middle Name"
                value={formState.middleName || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Date of Birth"
                id="birthdate"
                name="birthdate"
                placeholder="Enter Date of Birth"
                value={formState.birthdate || ""}
                onChange={handleChange}
                onBlur={handleBirthdateBlur}
              />
              <InputField
                label="Age"
                id="age"
                readOnly
                value={formState.age || ""}
              />
              <InputField
                label="Place of Birth"
                id="birthplace"
                name="birthplace"
                placeholder="Enter Place of Birth"
                value={formState.birthplace || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Address"
                id="address"
                name="address"
                placeholder="Enter Address"
                value={formState.address || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <SelectField
                label="Civil Status"
                id="civil-status"
                name="civilStatus"
                options={["Single", "Married", "Widowed"]}
                value={formState.civilStatus || ""}
                onChange={handleChange}
              />
              <SelectField
                label="Gender"
                id="gender"
                name="gender"
                options={["Male", "Female"]}
                value={formState.gender || ""}
                onChange={handleChange}
              />
              <SelectField
                label="Purpose"
                id="purpose"
                name="purpose"
                options={[
                  "Local Employment",
                  "Travel Abroad",
                  "L.T.O Requirement",
                  "Change of Name",
                  "NAPOLCOM Requirement",
                  "PNP Requirement"
                ]}
                value={formState.purpose || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Cedula Number"
                id="cedula-number"
                name="cedulaNumber"
                placeholder="Enter Cedula Number"
                value={formState.cedulaNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="Place Issued"
                id="place-issued"
                name="placeIssued"
                placeholder="Enter Place Issued"
                value={formState.placeIssued || ""}
                onChange={handleChange}
              />
              <InputField
                label="Date Issued"
                id="date-issued"
                name="dateIssued"
                placeholder="Enter Date Issued"
                value={formState.dateIssued || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="TIN Number"
                id="tin-number"
                name="tinNumber"
                placeholder="Enter TIN Number"
                value={formState.tinNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="OR Number"
                id="or-number"
                name="orNumber"
                placeholder="Enter OR Number"
                value={formState.orNumber || ""}
                onChange={handleChange}
              />
              <InputField
                label="Contact Number"
                id="contact-number"
                name="contactNumber"
                placeholder="Enter Contact Number"
                value={formState.contactNumber || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Findings"
                id="findings"
                name="findings"
                placeholder="Enter Findings"
                value={formState.findings || ""}
                onChange={handleChange}
              />
              <button style={{ width: 210 }} className="blue">
                PRINT OTHER CASE
              </button>
            </div>
          </div>
        </div>
        <FormButtons
            isEditing={isEditing}
            onClose={handleCancel}
            onSubmit={handleSubmit}
          />
      </div>
    </div>
  );
};

export default BarangayClearanceForm;