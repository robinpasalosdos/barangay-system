const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

require("./src/db/db.js");
require("./src/ipc/ipcHandler.js");
require("./src/ipc/userStatusIpcHandler.js");


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

  if (process.env.NODE_ENV === "development") {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer");
  
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }
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

