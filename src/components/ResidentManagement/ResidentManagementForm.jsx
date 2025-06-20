import React, { useState, useEffect, useContext, useRef } from "react";
import { ResidentContext } from "../../context";
import InputField from "../Shared/Form/InputField";
import FormButtons from "../Shared/Form/FormButtons";
import FingerprintCapture from "./FingerprintCapture";
import FaceCapture from "./FaceCapture";

const ResidentManagementForm = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditing,
    selectedData,
    setSelectedData,
    addOrUpdateRecord,
    image,
    setImage,
    fingerprints,
    setFingerprints,
  } = useContext(ResidentContext);

  // Ref for FingerprintCapture
  const fingerprintRef = useRef(null);

  const initialFormState = {
    lastName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    email: "",
  };
  

  const [formState, setFormState] = useState(initialFormState);
  const [fullName, setFullName] = useState("");
  const [imageCacheBust, setImageCacheBust] = useState(0);
  const [fingerprintCacheBust, setFingerprintCacheBust] = useState(Date.now());

  useEffect(() => {
    const fetchBiometrics = async () => {
      if (isEditing && selectedData && selectedData.userId) {
        console.log("selectedData", selectedData);
        setFormState(selectedData);

        // Fetch biometrics from Supabase
        const result = await window.api.fetchResidentBiometrics(selectedData.userId);
        if (result && !result.error) {
          // Set face image
          if (result.image_path) {
            setImage(
              `https://quxrkmkoadnsdqvqztyo.supabase.co/storage/v1/object/public/resident/${result.image_path}?t=${Date.now()}`
            );
            setImageCacheBust(Date.now());
          } else {
            setImage(`src/assets/placeholder.jpg`);
          }

          // Set fingerprints
          const savedFingerprintPath = {
            'left-thumb': null,
            'left-index': null,
            'left-middle': null,
            'left-ring': null,
            'left-pinky': null,
            'right-thumb': null,
            'right-index': null,
            'right-middle': null,
            'right-ring': null,
            'right-pinky': null,
          };
          result.fingerprints.forEach(fp => {
            savedFingerprintPath[fp.finger_type] = `https://quxrkmkoadnsdqvqztyo.supabase.co/storage/v1/object/public/resident/${fp.fingerprint_path}?t=${Date.now()}`;
          });
          setFingerprints(savedFingerprintPath);
          setFingerprintCacheBust(Date.now());
        } else {
          setFingerprints({});
        }
      } else {
        setFormState(initialFormState);
      }
    };

    fetchBiometrics();
  }, [isEditing, selectedData]);

  // Update fullName whenever the name fields change
  useEffect(() => {
    const newFullName = [
      formState.firstName || "",
      formState.middleName || "",
      formState.lastName || ""
    ].filter(Boolean).join(" ");
    setFullName(newFullName);
  }, [formState.firstName, formState.middleName, formState.lastName]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveImage = async (residentId) => {
    if (!image || !image.startsWith("data:image/")) {
        alert("Invalid image data.");
        return null;
    }
    try {
        const response = await window.api.saveResidentImage(image, residentId);
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
  const resetForm = () => {
    setFormState(initialFormState);
    setSelectedData(null);
  };

  const handleResetImages = () => {
    setImage(`src/assets/placeholder.jpg`);
    setFingerprints({});
  };

  // Handle form submission
  const handleSubmit = async () => {
    fingerprintRef.current?.stopAcquisition?.();
    try {
        if (!formState.firstName || !formState.lastName || !formState.dateOfBirth) {
          alert("Please fill in all required fields.");
          return;
        }
        if (!image || image === 'src/assets/placeholder.jpg') {
          alert("Please capture a face image.");
          return;
        }

        let residentId = isEditing ? selectedData?.userId : null;
        let record = {
          ...formState,
          faceFileName: null, // will be set after upload
          fingerprints: {}, // will be set after upload
        };

        if (isEditing) {
          record.userId = residentId;
          // Upload face image if changed (base64)
          if (image && image.startsWith('data:image/')) {
            const response = await window.api.saveResidentImage(image, residentId);
            if (response && response.publicUrl) {
              record.faceFileName = response.filePath;
              setImage(`${response.publicUrl}?t=${Date.now()}`);
              setImageCacheBust(Date.now());
            }
          }
          // Upload fingerprints if changed (base64)
          const updatedFingerprints = {};
          for (const [key, value] of Object.entries(fingerprints)) {
            if (value && value.startsWith('data:image/')) {
              const fpRes = await window.api.saveFingerprintImage(value, key, residentId);
              if (fpRes && fpRes.publicUrl) {
                updatedFingerprints[key] = fpRes.filePath;
              }
            }
          }
          record.fingerprints = updatedFingerprints;
        } else {
          // 2. If adding, create record first to get id, then upload images
          const addResult = await window.api.addResidentRecord(record);
          if (addResult && addResult.data && addResult.data[0] && addResult.data[0].userId) {
            residentId = addResult.data[0].userId;
            record.userId = residentId;
          } else {
            alert("Failed to create resident record.");
            return;
          }
          // Upload face image
          if (image && image.startsWith('data:image/')) {
            const response = await window.api.saveResidentImage(image, residentId);
            if (response && response.publicUrl) {
              record.faceFileName = response.filePath;
              setImage(`${response.publicUrl}?t=${Date.now()}`);
              setImageCacheBust(Date.now());
            }
          }
          // Upload fingerprints
          const updatedFingerprints = {};
          for (const [key, value] of Object.entries(fingerprints)) {
            if (value && value.startsWith('data:image/')) {
              const fpRes = await window.api.saveFingerprintImage(value, key, residentId);
              if (fpRes && fpRes.publicUrl) {
                updatedFingerprints[key] = fpRes.filePath;
              }
            }
          }
          record.fingerprints = updatedFingerprints;
        }

        if (!residentId) {
          alert("Resident ID not found.");
          return;
        }

        // Use context's addOrUpdateRecord to handle the update
        await addOrUpdateRecord(record);

        resetForm();
        handleResetImages();
        setIsModalOpen(false);
    } catch (error) {
        console.error("Submission error:", error);
        alert(`Failed to save: ${error.message}`);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Stop fingerprint acquisition
    fingerprintRef.current?.stopAcquisition?.();
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
    const age = calculateAge(formState.dateOfBirth);
    setFormState((prev) => ({ ...prev, age }));
  };

  if (!isModalOpen) return null;

  return (
    <div className="form-container">
      <div className="rmodal">
        <div>
          <FaceCapture fullName={fullName} />
          <FingerprintCapture ref={fingerprintRef} />
        </div> 
        <div>
          <div>
            <div>
              <InputField
                label="Last Name"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                value={formState.lastName || ""}
                onChange={handleChange}
              />

              <InputField
                label="First Name"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={formState.firstName || ""}
                onChange={handleChange}
              />

              <InputField
                label="Middle Name"
                id="middleName"
                name="middleName"
                placeholder="Enter Middle Name"
                value={formState.middleName || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Date of Birth"
                id="dateOfBirth"
                name="dateOfBirth"
                placeholder="Enter Date of Birth"
                value={formState.dateOfBirth || ""}
                onChange={handleChange}
              />

              <InputField
                label="Email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={formState.email || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <FormButtons
            isEditing={isEditing}
            onClose={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>     
      </div>
    </div>
  );
};

export default ResidentManagementForm;