const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  fetchRecords: () => ipcRenderer.invoke("fetch-records"),
  addRecord: (record) => ipcRenderer.invoke("add-record", record),
  updateRecord: (record) => ipcRenderer.invoke("update-record", record),
  deleteRecord: (id) => ipcRenderer.invoke("delete-record", id),
  saveImage: (base64Image) => ipcRenderer.invoke("save-image", base64Image)
});
