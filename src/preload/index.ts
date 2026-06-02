import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("Projects", {
  sendTemp: (text: string) => {
    console.log("ContextBridge have sent");
    ipcRenderer.send("saveText", text);
  },

  getProjects: () => ipcRenderer.invoke("getProjects"),
  createProject: (project_name: string) =>
    ipcRenderer.invoke("createProject", project_name),
});
