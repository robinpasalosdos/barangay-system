const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  fetchPoliceClearanceRecords: () => ipcRenderer.invoke("fetch-police-clearance-records"),
  addPoliceClearanceRecord: (record) => ipcRenderer.invoke("add-police-clearance-record", record),
  updatePoliceClearanceRecord: (record) => ipcRenderer.invoke("update-police-clearance-record", record),
  deletePoliceClearanceRecord: (id) => ipcRenderer.invoke("delete-police-clearance-record", id),
  savePoliceClearanceImage: (base64Image) => ipcRenderer.invoke("save-police-clearance-image", base64Image),
  fetchUsers: () => ipcRenderer.invoke("fetch-users"),
  addUser: (record) => ipcRenderer.invoke("add-user", record),
  updateUser: (record) => ipcRenderer.invoke("update-user", record),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", id),
});
