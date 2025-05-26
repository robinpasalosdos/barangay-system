import { app, BrowserWindow, screen, ipcMain } from "electron";
import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';

import "./src/db/db.js";
import "./src/ipc/ipcHandler.js";
import "./src/ipc/userStatusIpcHandler.js";
import "./src/ipc/loginIpcHandler.js";
import "./src/ipc/warrantBookingIpcHandlers.js";
import "./src/ipc/rogueDirectoryIpcHandlers.js";
import "./src/ipc/printIpcHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.on("ready", () => {
  console.log("Electron app is ready");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    console.log("IS DEV:", isDev);
    console.log("Loading:", isDev ? "http://localhost:5173" : join(__dirname, "dist", "index.html"));
    mainWindow.loadFile(join(__dirname, "dist", "index.html"));
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
  const folderPath = join(__dirname, 'public', 'assets', 'mugshots', lastname);
  // Ensure folder exists
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }

  for (const [label, base64] of Object.entries(images)) {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const fileName = `${label.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    const filePath = join(folderPath, fileName);

    writeFileSync(filePath, base64Data, 'base64');
  }

  mainWindow.webContents.openDevTools();

  return { status: 'done', path: folderPath };
});