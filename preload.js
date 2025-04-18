const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  fetchPoliceClearanceRecords: () => ipcRenderer.invoke("fetch-police-clearance-records"),
  addPoliceClearanceRecord: (record) => ipcRenderer.invoke("add-police-clearance-record", record),
  updatePoliceClearanceRecord: (record) => ipcRenderer.invoke("update-police-clearance-record", record),
  deletePoliceClearanceRecord: (id) => ipcRenderer.invoke("delete-police-clearance-record", id),
  savePoliceClearanceImage: (base64Image) => ipcRenderer.invoke("save-police-clearance-image", base64Image),
  
  fetchWarrantBookingRecords: () => ipcRenderer.invoke("fetch-warrant-booking-records"),
  addWarrantBookingRecord: (record) => ipcRenderer.invoke("add-warrant-booking-record", record),
  updateWarrantBookingRecord: (record) => ipcRenderer.invoke("update-warrant-booking-record", record),
  deleteWarrantBookingRecord: (id) => ipcRenderer.invoke("delete-warrant-booking-record", id),
  
  fetchUsers: () => ipcRenderer.invoke("fetch-users"),
  addUser: (record) => ipcRenderer.invoke("add-user", record),
  updateUser: (record) => ipcRenderer.invoke("update-user", record),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
  login: (credentials) => ipcRenderer.invoke("login", credentials),

  fetchRogueDirectoryRecords: () => ipcRenderer.invoke("fetch-rogue-directory-records"),
  addRogueDirectoryRecord: (record) => ipcRenderer.invoke("add-rogue-directory-record", record),
  updateRogueDirectoryRecord: (record) => ipcRenderer.invoke("update-rogue-directory-record", record),
  deleteRogueDirectoryRecord: (id) => ipcRenderer.invoke("delete-rogue-directory-record", id),
  saveMugshotCaptured: (images, lastname) => ipcRenderer.invoke('save-mugshot-captured', images, lastname),

  printRecord: (record) => ipcRenderer.send('print-record', record),
});
