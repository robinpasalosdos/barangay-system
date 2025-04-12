import React from "react";
import InputField from "../Shared/Form/InputField";
import SelectField from "../Shared/Form/SelectField";
import FormButtons from "../Shared/Form/FormButtons";
import BiometricsSectionFinger from "../Shared/Form/BiometricsSectionFinger";
import BiometricsSectionFace from "../Shared/Form/BiometricsSectionFace";

const Form = ({
  formState,
  handleChange,
  handleSubmit,
  handleCancel,
  handleBirthdateBlur,
  isFaceCaptureVisible,
  handleOpenFaceCapture,
  image,
  isEditing,
  handleOpenRightFingerprintCapture,
  handleOpenLeftFingerprintCapture,
  fingerprints
}) => {
  return (
    <div id="modal">
      <div id="id" hidden="" />
      <div className="modal">
        <div>
          <div>
            <div>
              <InputField
                label="Police Clearance No."
                id="clearance-number"
                name="clearanceNumber"
                placeholder={"Enter Police Clearance No."}
                value={formState.clearanceNumber || ""}
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
                  buttonText="SCAN"
                  onClick={handleOpenRightFingerprintCapture}
                  fingerprints={fingerprints["right-thumb"]}
                />
                <BiometricsSectionFinger
                  label="Left Finger 2:"
                  buttonText="SCAN"
                  onClick={handleOpenLeftFingerprintCapture}
                  fingerprints={fingerprints["left-thumb"]}
                />
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
                onBlur={handleBirthdateBlur} // Added missing prop
              />
              <InputField
                label="Age"
                id="age"
                readOnly
                value={formState.age || ""}
                width="92px"
              />
              <InputField
                label="Place of Birth"
                id="birthplace"
                name="birthplace"
                placeholder="Enter Place of Birth"
                value={formState.birthplace || ""}
                onChange={handleChange}
                width="328px"
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
                width="668px"
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
                  "PNP Requirement",
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
                width="668px"
              />
{/* <button style={{ width: 210 }} className="blue">
  PRINT OTHER CASE
</button> */}
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

export default Form;