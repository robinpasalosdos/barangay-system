import { ipcMain, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import fs from "fs";
import { promises as fsPromises } from 'fs';

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
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .letterhead { text-align: center; margin-bottom: 30px; }
        .document-body { line-height: 1.6; text-align: justify; }
        .signature-line { margin-top: 50px; text-align: right; }
        .photo-container {
          position: absolute;
          top: 80px;
          right: 40px;
          width: 2in;
          height: 2in;
          border: 1px solid #000;
        }
        .photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      </style>
    </head>
    <body>
      <div class="photo-container">
        <img class="photo" src="file:///${path.join(__dirname, '../../public/assets/faces', data.faceFileName)}" />
      </div>
      <div class="letterhead">
        <h3>POLICE CLEARANCE</h3>
        <p>Republic of the Philippines</p>
        <p>Province of [Province]</p>
        <p>City of [City]</p>
      </div>
      <div class="document-body">
        <p>This is to certify that ${data.firstName} ${data.lastName}, ${data.age} years old,
        residing at ${data.address} has no derogatory record on file with this office.</p>
        <p>This certification is issued upon the request of the above-named person for ${data.purpose}.</p>
        <p>Issued on: ${data.dateIssued}</p>
      </div>
      <div class="signature-line">
        <p>Chief of Police</p>
        <p>[Name of Police Chief]</p>
      </div>
    </body>
    </html>
  `,
  
  barangayClearance: (data) => `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .letterhead { text-align: center; margin-bottom: 30px; }
        .document-body { line-height: 1.6; text-align: justify; }
        .signature-line { margin-top: 50px; text-align: right; }
        .photo-container {
          position: absolute;
          top: 80px;
          right: 40px;
          width: 2in;
          height: 2in;
          border: 1px solid #000;
        }
        .photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      </style>
    </head>
    <body>
      <div class="photo-container">
        <img class="photo" src="file:///${path.join(__dirname, '../../public/assets/faces', data.faceFileName)}" />
      </div>
      <div class="letterhead">
        <h3>BARANGAY CLEARANCE</h3>
        <p>Republic of the Philippines</p>
        <p>Barangay [Barangay Name]</p>
      </div>
      <div class="document-body">
        <p>TO WHOM IT MAY CONCERN:</p>
        <p>This is to certify that ${data.firstName} ${data.lastName}, ${data.age} years old,
        is a bonafide resident of ${data.address}, Barangay [Barangay Name].</p>
        <p>This certification is being issued upon request of the above-named person for ${data.purpose}.</p>
        <p>Issued on: ${data.dateIssued}</p>
      </div>
      <div class="signature-line">
        <p>Barangay Captain</p>
        <p>[Name of Barangay Captain]</p>
      </div>
    </body>
    </html>
  `,
  
  barangayCertificate: (data) => `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .letterhead { text-align: center; margin-bottom: 30px; }
        .document-body { line-height: 1.6; text-align: justify; }
        .signature-line { margin-top: 50px; text-align: right; }
        .photo-container {
          position: absolute;
          top: 80px;
          right: 40px;
          width: 2in;
          height: 2in;
          border: 1px solid #000;
        }
        .photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      </style>
    </head>
    <body>
      <div class="photo-container">
        <img class="photo" src="file:///${path.join(__dirname, '../../public/assets/faces', data.faceFileName)}" />
      </div>
      <div class="letterhead">
        <h3>BARANGAY CERTIFICATE</h3>
        <p>Republic of the Philippines</p>
        <p>Barangay [Barangay Name]</p>
      </div>
      <div class="document-body">
        <p>TO WHOM IT MAY CONCERN:</p>
        <p>This is to certify that ${data.firstName} ${data.lastName}, ${data.age} years old,
        Filipino, is a resident of ${data.address}, Barangay [Barangay Name].</p>
        <p>Based on records of this office, he/she is of good moral character and a law-abiding citizen.</p>
        <p>This certification is being issued upon request of the above-named person for ${data.purpose}.</p>
        <p>Issued on: ${data.dateIssued}</p>
      </div>
      <div class="signature-line">
        <p>Barangay Captain</p>
        <p>[Name of Barangay Captain]</p>
      </div>
    </body>
    </html>
  `
};

async function getImageAsBase64(faceFileName) {
  try {
    const imagePath = path.join(__dirname, '../../public/assets/faces', faceFileName);
    const imageBuffer = await fsPromises.readFile(imagePath);
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error loading image:', error);
    const placeholderPath = path.join(__dirname, '../../public/assets/placeholder.png');
    const placeholderBuffer = await fsPromises.readFile(placeholderPath);
    return `data:image/png;base64,${placeholderBuffer.toString('base64')}`;
  }
}

async function generateSelectedPDFs(record, selections) {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const imageData = await getImageAsBase64(record.faceFileName);
    
    for (const [key, isSelected] of Object.entries(selections)) {
      if (!isSelected) continue;

      const template = templates[key];
      const html = template(record).replace(
        /src="file:\/\/\/.*?"/,
        `src="${imageData}"`
      );
      
      const page = await browser.newPage();
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

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

ipcMain.on("print-selected", async (event, { record, selections }) => {
  await generateSelectedPDFs(record, selections);
});
