const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const http = require("http");

let flaskProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");
}

function getBasePath() {
  const basePath =
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, "../backend")
      : path.join(process.resourcesPath, "backend");
  return basePath;
}

function getPythonPath() {
  const basePath = getBasePath();
  let pythonPath = path.join(basePath, ".venv", "bin", "python");

  if (process.platform === "win32") {
    pythonPath = path.join(basePath, ".venv", "Scripts", "python.exe");
  }
  return pythonPath;
}

function startFlask() {
  const pythonPath = getPythonPath();

  if (!fs.existsSync(pythonPath)) {
    console.error(`Python path not found: ${pythonPath}`);
    console.error(`Please ensure the virtual environment is set up correctly.`);
    return;
  }

  const checkPortCommand =
    process.platform === "win32"
      ? `netstat -ano | findstr :8000`
      : `lsof -i :8000`;
  const killCommand =
    process.platform === "win32" ? `taskkill /F /PID` : `kill -9`;

  exec(checkPortCommand, (err, stdout) => {
    if (stdout) {
      const lines = stdout.trim().split("\n");
      lines.forEach((line) => {
        const parts = line.split(/\s+/);
        const pid = process.platform === "win32" ? parts[4] : parts[1];
        if (pid && !isNaN(pid)) {
          exec(`${killCommand} ${pid}`, (killErr) => {
            if (killErr) {
              console.error(`Error killing process ${pid}:`, killErr);
            }
          });
        }
      });
    }

    flaskProcess = spawn(
      pythonPath,
      ["-m", "gunicorn", "-c", "gunicorn_config.py", "app:app"],
      {
        cwd: getBasePath(),
      }
    );

    flaskProcess.stdout.on("data", (data) => {
      console.log(`Flask stdout: ${data}`);
    });

    flaskProcess.stderr.on("data", (data) => {
      console.error(`Flask stderr: ${data}`);
    });

    flaskProcess.on("close", (code) => {
      console.log(`Flask process exited with code ${code}`);
      flaskProcess = null;
    });

    flaskProcess.on("error", (err) => {
      console.error(`Failed to start Flask process: ${err.message}`);
    });

    // Check if the Flask server is accessible
    setTimeout(checkFlaskServer, 5000);
  });
}

function checkFlaskServer() {
  http
    .get("http://127.0.0.1:8000/api/message", (res) => {
      console.log(`Got response: ${res.statusCode}`);
      res.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
    })
    .on("error", (e) => {
      console.error(`Flask server not accessible: ${e.message}`);
    });
}

app.whenReady().then(() => {
  startFlask();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (flaskProcess) {
    flaskProcess.kill();
  }
});

ipcMain.handle("fetch-message", async () => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("http://127.0.0.1:8000/api/message");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching message:", error);
    return "Error fetching message";
  }
});
