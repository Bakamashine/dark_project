//#region src/main.js
var { app, BrowserWindow } = require("electron");
require("path");
function createWindow() {
	new BrowserWindow({
		width: 800,
		height: 600
	}).loadURL("http://localhost:5173");
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion
