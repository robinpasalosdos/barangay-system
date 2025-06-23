import React, { useState, useEffect } from "react";
import InputField from "../Shared/Form/InputField";

const initialFormState = {
  lastName: "",
  firstName: "",
  middleName: "",
  dateOfBirth: "",
  email: "",
  address: "",
  phoneNumber: "",
  sex: "",
  country: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  street: "",
  blockNumber: "",
  zipCode: "",
  citizenship: "",
  civilStatus: "",
  eyeColor: "",
  hairColor: "",
  height: "",
  weight: "",
  complexion: "",
  identifyingMarks: "",
};

const thumbStyle = {
  width: "90px",
  height: "126px",
  borderRadius: "12px",
  border: "2px solid #444",
  backgroundColor: "#1b1f30",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  margin: "0 10px",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const faceStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  border: "2px solid #444",
  objectFit: "cover",
  marginBottom: "10px",
};

const searchResultStyle = {
  background: "#f5f5f5",
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "6px 12px",
  fontSize: "14px",
  color: "#333",
  cursor: "pointer",
  marginBottom: "4px",
};

const BarangayClearanceForm = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [faceUrl, setFaceUrl] = useState(null);
  const [leftThumbUrl, setLeftThumbUrl] = useState(null);
  const [rightThumbUrl, setRightThumbUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search residents
  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    window.api.fetchResidentRecords({ searchQuery: search, searchBy: "last_name" })
      .then((res) => {
        if (!active) return;
        if (Array.isArray(res)) setSearchResults(res);
        else setSearchResults([]);
      })
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, [search]);

  // When resident is selected, fill form and fetch biometrics
  useEffect(() => {
    if (!selectedResident) {
      setFormState(initialFormState);
      setFaceUrl(null);
      setLeftThumbUrl(null);
      setRightThumbUrl(null);
      return;
    }
    setFormState({ ...initialFormState, ...selectedResident });
    // Fetch biometrics
    window.api.fetchResidentBiometrics(selectedResident.userId || selectedResident.user_id)
      .then((result) => {
        if (result && !result.error) {
          if (result.image_path) {
            setFaceUrl(
              `https://quxrkmkoadnsdqvqztyo.supabase.co/storage/v1/object/public/resident/${result.image_path}?t=${Date.now()}`
            );
          } else {
            setFaceUrl("src/assets/placeholder.jpg");
          }
          let left = null, right = null;
          (result.fingerprints || []).forEach(fp => {
            if (fp.finger_type === "left-thumb") left = `https://quxrkmkoadnsdqvqztyo.supabase.co/storage/v1/object/public/resident/${fp.fingerprint_path}?t=${Date.now()}`;
            if (fp.finger_type === "right-thumb") right = `https://quxrkmkoadnsdqvqztyo.supabase.co/storage/v1/object/public/resident/${fp.fingerprint_path}?t=${Date.now()}`;
          });
          setLeftThumbUrl(left);
          setRightThumbUrl(right);
        } else {
          setFaceUrl("src/assets/placeholder.jpg");
          setLeftThumbUrl(null);
          setRightThumbUrl(null);
        }
      });
  }, [selectedResident]);

  // Only display, no editing
  return (
    <div className="rmodal" style={{ minWidth: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <InputField
          label="Search Resident"
          id="search"
          name="search"
          placeholder="Type last name, first name, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && searchResults.length > 0 && (
          <div style={{ maxHeight: 180, overflowY: "auto", marginTop: 4, marginBottom: 8 }}>
            {searchResults.map(res => (
              <div
                key={res.userId || res.user_id}
                style={searchResultStyle}
                onClick={() => {
                  setSelectedResident(res);
                  setSearch("");
                  setSearchResults([]);
                }}
              >
                {res.lastName}, {res.firstName} {res.middleName} ({res.email})
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
        <div>
          <img
            src={faceUrl || "src/assets/placeholder.jpg"}
            alt="Face"
            style={faceStyle}
          />
          <div style={{ textAlign: "center", fontSize: 13, color: "#888" }}>Face</div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={thumbStyle}>
              {leftThumbUrl ? (
                <img src={leftThumbUrl} alt="Left Thumb" style={imageStyle} />
              ) : (
                <span style={{ color: "#888", fontSize: 12 }}>No Image</span>
              )}
            </div>
            <div style={thumbStyle}>
              {rightThumbUrl ? (
                <img src={rightThumbUrl} alt="Right Thumb" style={imageStyle} />
              ) : (
                <span style={{ color: "#888", fontSize: 12 }}>No Image</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginTop: 4 }}>
            <span style={{ width: 90, textAlign: "center" }}>Left Thumb</span>
            <span style={{ width: 90, textAlign: "center" }}>Right Thumb</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Last Name" id="lastName" name="lastName" value={formState.lastName} readOnly />
        <InputField label="First Name" id="firstName" name="firstName" value={formState.firstName} readOnly />
        <InputField label="Middle Name" id="middleName" name="middleName" value={formState.middleName} readOnly />
        <InputField label="Date of Birth" id="dateOfBirth" name="dateOfBirth" value={formState.dateOfBirth} readOnly />
        <InputField label="Email" id="email" name="email" value={formState.email} readOnly />
        <InputField label="Address" id="address" name="address" value={formState.address} readOnly />
        <InputField label="Phone Number" id="phoneNumber" name="phoneNumber" value={formState.phoneNumber} readOnly />
        <InputField label="Sex" id="sex" name="sex" value={formState.sex} readOnly />
        <InputField label="Country" id="country" name="country" value={formState.country} readOnly />
        <InputField label="Region" id="region" name="region" value={formState.region} readOnly />
        <InputField label="Province" id="province" name="province" value={formState.province} readOnly />
        <InputField label="City" id="city" name="city" value={formState.city} readOnly />
        <InputField label="Barangay" id="barangay" name="barangay" value={formState.barangay} readOnly />
        <InputField label="Street" id="street" name="street" value={formState.street} readOnly />
        <InputField label="Block Number" id="blockNumber" name="blockNumber" value={formState.blockNumber} readOnly />
        <InputField label="Zip Code" id="zipCode" name="zipCode" value={formState.zipCode} readOnly />
        <InputField label="Citizenship" id="citizenship" name="citizenship" value={formState.citizenship} readOnly />
        <InputField label="Civil Status" id="civilStatus" name="civilStatus" value={formState.civilStatus} readOnly />
        <InputField label="Eye Color" id="eyeColor" name="eyeColor" value={formState.eyeColor} readOnly />
        <InputField label="Hair Color" id="hairColor" name="hairColor" value={formState.hairColor} readOnly />
        <InputField label="Height (cm)" id="height" name="height" value={formState.height} readOnly />
        <InputField label="Weight (kg)" id="weight" name="weight" value={formState.weight} readOnly />
        <InputField label="Complexion" id="complexion" name="complexion" value={formState.complexion} readOnly />
        <InputField label="Identifying Marks" id="identifyingMarks" name="identifyingMarks" value={formState.identifyingMarks} readOnly />
      </div>
    </div>
  );
};

export default BarangayClearanceForm;