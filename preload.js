const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  fetchPoliceClearanceRecords: (filters) => ipcRenderer.invoke("fetch-police-clearance-records", filters),
  addPoliceClearanceRecord: (record) => ipcRenderer.invoke("add-police-clearance-record", record),
  updatePoliceClearanceRecord: (record) => ipcRenderer.invoke("update-police-clearance-record", record),
  deletePoliceClearanceRecord: (id) => ipcRenderer.invoke("delete-police-clearance-record", id),
  savePoliceClearanceImage: (base64Image) => ipcRenderer.invoke("save-police-clearance-image", base64Image),
  
  fetchWarrantBookingRecords: () => ipcRenderer.invoke("fetch-warrant-booking-records"),
  addWarrantBookingRecord: (record) => ipcRenderer.invoke("add-warrant-booking-record", record),
  updateWarrantBookingRecord: (record) => ipcRenderer.invoke("update-warrant-booking-record", record),
  deleteWarrantBookingRecord: (id) => ipcRenderer.invoke("delete-warrant-booking-record", id),
  
  fetchUsers: (filters) => ipcRenderer.invoke("fetch-users", filters),
  addUser: (record) => ipcRenderer.invoke("add-user", record),
  updateUser: (record) => ipcRenderer.invoke("update-user", record),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
  login: (credentials) => ipcRenderer.invoke("login", credentials),
  logout: () => ipcRenderer.invoke("logout"),

  fetchRogueDirectoryRecords: () => ipcRenderer.invoke("fetch-rogue-directory-records"),
  addRogueDirectoryRecord: (record) => ipcRenderer.invoke("add-rogue-directory-record", record),
  updateRogueDirectoryRecord: (record) => ipcRenderer.invoke("update-rogue-directory-record", record),
  deleteRogueDirectoryRecord: (id) => ipcRenderer.invoke("delete-rogue-directory-record", id),
  saveMugshotCaptured: (images, lastname) => ipcRenderer.invoke('save-mugshot-captured', images, lastname),

  fetchResidentRecords: (filters) => ipcRenderer.invoke("fetch-resident-records", filters),
  addResidentRecord: (record) => ipcRenderer.invoke("add-resident-record", record),
  updateResidentRecord: (record) => ipcRenderer.invoke("update-resident-record", record),
  deleteResidentRecord: (user_id) => ipcRenderer.invoke("delete-resident-record", user_id),
  saveResidentImage: (base64Image, residentId) => ipcRenderer.invoke("save-resident-image", base64Image, residentId),

  capture: () => ipcRenderer.invoke('capture-fingerprint'),

  printRecord: (record) => ipcRenderer.send('print-record', record),

  saveFingerprintImage: (base64Image, fingerType, residentId) => ipcRenderer.invoke("save-fingerprint-image", base64Image, fingerType, residentId),
  scanFingerprint: () => ipcRenderer.invoke('scan-fingerprint'),

  fetchResidentBiometrics: (residentId) => ipcRenderer.invoke("fetch-resident-biometrics", residentId),

  fetchBarangayClearanceFullDetails: (userId) => ipcRenderer.invoke("fetch-barangay-clearance-full-details", userId),
});
