import { ipcMain, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = path.join(__dirname, "../../preload-print.js");
const printHtmlPath = path.join(__dirname, "../../print.html");

ipcMain.on("print-record", (event, record) => {
  const printWin = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      preload: preloadPath
    },
  });

  printWin.loadFile(printHtmlPath).then(() => {
    printWin.webContents.send("record-data", record);
  });

  printWin.webContents.on("did-finish-print", (success) => {
    if (success) {
      printWin.close();
    } else {
      console.log("Print canceled or failed");
    }
  });
});

const outputDir = path.join(__dirname, "../../pdf-output");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const templates = {
  police: (data) => `
    <html><body>
      <h1>Police Clearance</h1>
      <p>Name: ${data.lastName}</p>
      <p>Address: ${data.address}</p>
      <p>Date: ${data.dateIssued}</p>
      <p>Purpose: ${data.purpose}</p>
    </body></html>
  `,
  barangayClearance: (data) => `
    <html><body>
      <h1>Barangay Clearance</h1>
      <p>This certifies that ${data.lastName} is a resident of ${data.address}.</p>
      <p>Issued on ${data.dateIssued} for ${data.purpose}.</p>
    </body></html>
  `,
  barangayCertificate: (data) => `
    <html><body>
      <h1>Barangay Certificate</h1>
      <p>To whom it may concern,</p>
      <p>${data.lastName} resides at ${data.address}.</p>
      <p>Issued on: ${data.dateIssued}</p>
    </body></html>
  `
};

async function generateSelectedPDFs(record, selections) {
  const browser = await puppeteer.launch({ headless: true });
  try {
    for (const [key, isSelected] of Object.entries(selections)) {
      if (!isSelected) continue;

      const template = templates[key];
      const html = template(record);
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });

      const filename = key.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`) + ".pdf";
      const filePath = path.join(outputDir, filename);
      await page.pdf({ path: filePath, format: 'A4', printBackground: true });
      await page.close();

      console.log(`✅ Printed: ${filePath}`);
    }
  } catch (err) {
    console.error("❌ Print failed:", err);
  } finally {
    await browser.close();
  }
}

// 🧠 This listens for selections from renderer
ipcMain.on("print-selected", async (event, { record, selections }) => {
  await generateSelectedPDFs(record, selections);
});
