import { app, BrowserWindow, ipcMain, WebContentsView } from "electron";
import { join } from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import { open } from "node:fs/promises";

const isDev = !app.isPackaged;
const env_scheme = {
  startPage: 1,
};

const project_dir = "projects";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const convertObjectToString = (scheme: object) => {
  let temp_string: string = "";
  for (const [key, value] of Object.entries(env_scheme)) {
    temp_string += `${key}=${value}\n`;
  }
  return temp_string;
};

const getBasicPath = (path: string, file_name: string = "index.html") =>
  `${project_dir}/${path}/${file_name}`;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: join(__dirname, "../preload/index.mjs"),
      devTools: true,
    },
  });

  if (isDev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  fs.mkdirSync(project_dir, { recursive: true });
}

ipcMain.handle("getProjects", async () => {
  const dirs = await fs.promises.readdir(project_dir);
  console.log("Get all projects: ", dirs);
  return dirs;
});

ipcMain.handle("createProject", async (_, project_name: string) => {
  try {
    const _path = `${project_dir}/${project_name}`;
    await fs.promises.mkdir(_path);
    await fs.promises.access(_path);

    await fs.promises.writeFile(
      `${_path}/.env`,
      convertObjectToString(env_scheme),
    );
    return project_name;
  } catch (err) {
    console.log(err);
    return null;
  }
});

ipcMain.handle(
  "getResource",
  async (_, path: string, file_name: string = "index.html") => {
    try {
      const res = await fs.promises.readFile(
        `${project_dir}/${path}/${file_name}`,
        "utf-8",
      );
      console.log("getResource: ", res);
      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

ipcMain.handle(
  "save",
  async (_, path: string, new_content: string, file_name: string) => {
    try {
      await fs.promises.writeFile(
        `${project_dir}/${path}/${file_name}`,
        new_content,
      );
      console.log("file successfully updated!");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
);

ipcMain.handle(
  "getResourceArray",
  async (_, path: string, file_name: string) => {
    try {
      const str_array = await open(getBasicPath(path));
      // return str_array.readLines()
      const temp_arr = [];
      for await (const line of str_array.readLines()) {
        temp_arr.push(line);
      }

      return temp_arr;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

ipcMain.handle("saveToPdf", async (_, _path: string, htmlContent: string) => {
  const pdfPath = getBasicPath(_path, "main.pdf");

  const printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });

  const styledHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 5mm 5mm 5mm 20mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Times New Roman", Times, serif; font-size: 14pt; }
    .page { page-break-after: always; width: 100%; }
    .page:last-child { page-break-after: auto; }
    .border { border: 1px solid #000; padding: 10px; min-height: 287mm; display: flex; flex-direction: column; }
    .title-one { text-align: center; font-size: 18pt; font-weight: bold; margin: 20px 0; }
    .stamp { margin: auto -10px -10px; height: 70px; border-top: 1px solid #000; display: flex; }
    .left { width: 270px; flex-shrink: 0; display: flex; flex-direction: column; }
    .left-top { height: 40px; border-bottom: 1px solid #000; display: grid; grid-template-columns: 40px 45px 90px 50px 45px; }
    .left-top div { border-right: 1px solid #000; }
    .left-top div:last-child { border-right: none; }
    .left-bottom { flex: 1; display: grid; grid-template-columns: 40px 45px 90px 50px 45px; }
    .left-bottom div { border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; font-size: 9pt; text-align: center; }
    .left-bottom div:last-child { border-right: none; }
    .center { flex: 1; border-left: 1px solid #000; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; font-size: 10pt; }
    .right { width: 48px; flex-shrink: 0; display: flex; flex-direction: column; }
    .right-top { height: 22px; border-bottom: 1px solid #000; display: flex; align-items: center; justify-content: center; font-size: 9pt; }
    .right-bottom { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 10pt; }
    img {width: 200px; height: 200px;}
    .img-one {width: 500px; height: 500px;}
  </style>
</head>
<body>${htmlContent}</body>
</html>`;

  await printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(styledHtml)}`,
  );

  const options: Electron.PrintToPDFOptions = {
    margins: {
      top: 0.19685,
      bottom: 0.19685,
      right: 0.19685,
      left: 0.7874,
    },
    pageSize: "A4",
    printBackground: true,
    landscape: false,
  };

  const data = await printWindow.webContents.printToPDF(options);
  if (data) {
    await fs.promises.writeFile(pdfPath, data, { flag: "w" });
    console.log("PDF saved to", pdfPath);
  }
  printWindow.close();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
