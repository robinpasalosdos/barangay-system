const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  fetchRecords: () => ipcRenderer.invoke("fetch-records"),
  addRecord: (record) => ipcRenderer.invoke("add-record", record),
  updateRecord: (record) => ipcRenderer.invoke("update-record", record), // Add this
  deleteRecord: (id) => ipcRenderer.invoke("delete-record", id),
});
