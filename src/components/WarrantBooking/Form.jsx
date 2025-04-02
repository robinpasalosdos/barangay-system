import React from "react";
import InputField from "../Shared/Form/InputField";
import SelectField from "../Shared/Form/SelectField";
import FormButtons from "../Shared/Form/FormButtons";

const Form = ({
  formState,
  handleChange,
  handleSubmit,
  handleCancel,
  handleBirthdateBlur,
  isEditing,
}) => {
  return (
    <div id="modal">
      <div id="id" hidden="" />
      <div className="wmodal">
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
                label="Place of Birth"
                id="placeOfBirth"
                name="placeOfBirth"
                placeholder="Enter Place of Birth"
                value={formState.placeOfBirth || ""}
                onChange={handleChange}
              />

              <InputField
                label="Age"
                id="age"
                name="age"
                type="number"
                placeholder="Enter Age"
                value={formState.age || ""}
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
                width="668px"
              />
            </div>
            <div>
             <SelectField
                label="Civil Status"
                id="civilStatus"
                name="civilStatus"
                options={["Single", "Married", "Widowed"]}
                value={formState.civilStatus || ""}
                onChange={handleChange}
              />

              <SelectField
                label="Gender"
                id="gender"
                name="gender"
                options={["Male", "Female", "Other"]}
                value={formState.gender || ""}
                onChange={handleChange}
              />

              <SelectField
                label="Citizenship"
                id="citizenship"
                name="citizenship"
                options={["Filipino", "American", "Other"]}
                value={formState.citizenship || ""}
                onChange={handleChange}
              />
            </div>
            <div>
             <InputField
                label="Height"
                id="height"
                name="height"
                placeholder="Enter Height"
                value={formState.height || ""}
                onChange={handleChange}
              />

              <InputField
                label="Color of Hair"
                id="colorOfHair"
                name="colorOfHair"
                placeholder="Enter Hair Color"
                value={formState.colorOfHair || ""}
                onChange={handleChange}
              />

              <InputField
                label="Complexion"
                id="complexion"
                name="complexion"
                placeholder="Enter Complexion"
                value={formState.complexion || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Weight"
                id="weight"
                name="weight"
                placeholder="Enter Weight"
                value={formState.weight || ""}
                onChange={handleChange}
              />

              <InputField
                label="Color of Eyes"
                id="colorOfEyes"
                name="colorOfEyes"
                placeholder="Enter Eye Color"
                value={formState.colorOfEyes || ""}
                onChange={handleChange}
              />

              <InputField
                label="FP Syllabus"
                id="fpSyllabus"
                name="fpSyllabus"
                placeholder="Enter FP Syllabus"
                value={formState.fpSyllabus || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="CCIS Number"
                id="ccisNumber"
                name="ccIsNumber"
                placeholder="Enter CCIS Number"
                value={formState.ccIsNumber || ""}
                onChange={handleChange}
              />

              <InputField
                label="Crime Committed"
                id="crimeCommitted"
                name="crimeCommitted"
                placeholder="Enter Crime Committed"
                value={formState.crimeCommitted || ""}
                onChange={handleChange}
              />

              <InputField
                label="Committed Date"
                id="committedDate"
                name="committedDate"
                placeholder="Enter Committed Date"
                value={formState.committedDate || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <InputField
                label="Place of Crime"
                id="placeOfCrime"
                name="placeOfCrime"
                placeholder="Enter Place of Crime"
                value={formState.placeOfCrime || ""}
                onChange={handleChange}
              />

              <InputField
                label="Place of Inquisition"
                id="placeOfInquisition"
                name="placeOfInquisition"
                placeholder="Enter Place of Inquisition"
                value={formState.placeOfInquisition || ""}
                onChange={handleChange}
              />

              <InputField
                label="Remarks"
                id="remarks"
                name="remarks"
                placeholder="Enter Remarks"
                value={formState.remarks || ""}
                onChange={handleChange}
              />
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