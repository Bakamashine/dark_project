import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const isDev = !app.isPackaged;

const project_dir = "projects";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: join(__dirname, "../preload/index.mjs"),
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

ipcMain.handle("createProject", async (event, project_name: string) => {
  try {
    const _path = `${project_dir}/${project_name}`
    await fs.promises.mkdir(_path);
    await fs.promises.access(_path)
    return project_name;
  } catch (err) {
    console.log(err);
    return null;
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
