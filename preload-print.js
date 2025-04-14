import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronPrintAPI', {
  onRecordData: (callback) => ipcRenderer.on('record-data', (event, data) => callback(data)),
  sendSelections: (record, selections) => ipcRenderer.send('print-selected', { record, selections })
});
