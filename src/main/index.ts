import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { open } from "node:fs/promises";

const isDev = !app.isPackaged;

const project_dir = "projects";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getBasicPath = (path: string, file_name: string = "index.html") =>
  `${project_dir}/${path}/${file_name}`;

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

ipcMain.handle("createProject", async (_, project_name: string) => {
  try {
    const _path = `${project_dir}/${project_name}`;
    await fs.promises.mkdir(_path);
    await fs.promises.access(_path);
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
        temp_arr.push(line)
      }

      return temp_arr
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
