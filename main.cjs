const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const fs = require('fs');

require("./src/db/db.js");
require("./src/ipc/ipcHandler.js");
require("./src/ipc/userStatusIpcHandler.js");
require("./src/ipc/loginIpcHandler.js");
require("./src/ipc/warrantBookingIpcHandlers.js");
require("./src/ipc/rogueDirectoryIpcHandlers.js");
require("./src/ipc/printIpcHandlers.js");



let mainWindow;

app.on("ready", () => {
  console.log("Electron app is ready");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
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

ipcMain.handle('save-mugshot-captured', async (event, images, lastname) => {
  const folderPath = path.join(__dirname, 'public', 'assets', 'mugshots', lastname);
  // Ensure folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  for (const [label, base64] of Object.entries(images)) {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const fileName = `${label.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, base64Data, 'base64');
  }

  return { status: 'done', path: folderPath };
});


