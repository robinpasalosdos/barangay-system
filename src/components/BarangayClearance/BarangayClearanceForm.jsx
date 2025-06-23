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

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Only display, no editing
  return (
    <div className="form-container">
      <div className="bmodal">
        <div>
          <div>
            <div className="face-container">
              <img
                src={faceUrl || "src/assets/placeholder.jpg"}
                alt="Profile Picture"
              />
            </div>
            <div>
              <div>
                <span style={{ width: 90, textAlign: "center" }}>Left Thumb</span>
                <div style={thumbStyle}>
                  {leftThumbUrl ? (
                    <img src={leftThumbUrl} alt="Left Thumb" style={imageStyle} />
                  ) : (
                    <span style={{ color: "#888", fontSize: 12 }}>No Image</span>
                  )}
                </div>
              </div>
              <div>
                <span style={{ width: 90, textAlign: "center" }}>Right Thumb</span>
                <div style={thumbStyle}>
                  {rightThumbUrl ? (
                    <img src={rightThumbUrl} alt="Right Thumb" style={imageStyle} />
                  ) : (
                    <span style={{ color: "#888", fontSize: 12 }}>No Image</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <tbody>
                <tr><td><b>Last Name</b></td><td>{formState.lastName}</td></tr>
                <tr><td><b>First Name</b></td><td>{formState.firstName}</td></tr>
                <tr><td><b>Middle Name</b></td><td>{formState.middleName}</td></tr>
                <tr><td><b>Date of Birth</b></td><td>{formState.dateOfBirth}</td></tr>
                <tr><td><b>Email</b></td><td>{formState.email}</td></tr>
                <tr><td><b>Address</b></td><td>{formState.address}</td></tr>
                <tr><td><b>Phone Number</b></td><td>{formState.phoneNumber}</td></tr>
                <tr><td><b>Sex</b></td><td>{formState.sex}</td></tr>
                <tr><td><b>Country</b></td><td>{formState.country}</td></tr>
                <tr><td><b>Region</b></td><td>{formState.region}</td></tr>
                <tr><td><b>Province</b></td><td>{formState.province}</td></tr>
                <tr><td><b>City</b></td><td>{formState.city}</td></tr>
                <tr><td><b>Barangay</b></td><td>{formState.barangay}</td></tr>
                <tr><td><b>Street</b></td><td>{formState.street}</td></tr>
                <tr><td><b>Block Number</b></td><td>{formState.blockNumber}</td></tr>
                <tr><td><b>Zip Code</b></td><td>{formState.zipCode}</td></tr>
                <tr><td><b>Citizenship</b></td><td>{formState.citizenship}</td></tr>
                <tr><td><b>Civil Status</b></td><td>{formState.civilStatus}</td></tr>
                <tr><td><b>Eye Color</b></td><td>{formState.eyeColor}</td></tr>
                <tr><td><b>Hair Color</b></td><td>{formState.hairColor}</td></tr>
                <tr><td><b>Height (cm)</b></td><td>{formState.height}</td></tr>
                <tr><td><b>Weight (kg)</b></td><td>{formState.weight}</td></tr>
                <tr><td><b>Complexion</b></td><td>{formState.complexion}</td></tr>
                <tr><td><b>Identifying Marks</b></td><td>{formState.identifyingMarks}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div>
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
          <div>
            <div>
              <InputField label="Document Number" id="documentNumber" name="documentNumber" value={formState.documentNumber || ''} onChange={onChange} />
            </div>
            <div>
              <InputField label="Barangay Clearance Number" id="barangayClearanceNumber" name="barangayClearanceNumber" value={formState.barangayClearanceNumber || ''} onChange={onChange} />
            </div>
            <div>
              <InputField label="Cedula Number" id="cedulaNumber" name="cedulaNumber" value={formState.cedulaNumber || ''} onChange={onChange} />
            </div>
            <div>
              <InputField label="Place Issued" id="placeIssued" name="placeIssued" value={formState.placeIssued || ''} onChange={onChange} />
            </div>
            <div>
              <InputField label="Date Issued" id="dateIssued" name="dateIssued" type="date" value={formState.dateIssued || ''} onChange={onChange} />
            </div>
            <div>
              <InputField label="OR Number" id="orNumber" name="orNumber" value={formState.orNumber || ''} onChange={onChange} />
            </div>
            <div>
              <InputField label="OR Date" id="orDate" name="orDate" type="date" value={formState.orDate || ''} onChange={onChange} />
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayClearanceForm;

