const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

require("./src/db/db.js");
require("./src/ipc/ipcHandler.js");

let mainWindow;

app.on("ready", () => {
  console.log("Electron app is ready");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.emit("ready");
  }
});
