const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onRecordData: (callback) => ipcRenderer.on("record-data", callback),
});
