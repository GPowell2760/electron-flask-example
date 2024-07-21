const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchMessage: () => ipcRenderer.invoke("fetch-message"),
});
