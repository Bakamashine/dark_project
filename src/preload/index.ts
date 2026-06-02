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

contextBridge.exposeInMainWorld("Files", {
  getResource: (path: string, file_name: string = "index.html") =>
    ipcRenderer.invoke("getResource", path, file_name),

  save: (path: string, new_content: string, file_name: string = 'index.html') => 
    ipcRenderer.invoke("save", path, new_content, file_name),
})
