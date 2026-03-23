const { app, BrowserWindow } = require('electron');
const path = require('path');

// Start the backend server
const server = require('./server/index.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: '#F7F8FA',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Wait for server to be ready, then load
  const PORT = 3847;
  const checkServer = () => {
    const http = require('http');
    http.get(`http://localhost:${PORT}/api/health`, (res) => {
      mainWindow.loadURL(`http://localhost:${PORT}`);
    }).on('error', () => {
      setTimeout(checkServer, 200);
    });
  };
  checkServer();

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (mainWindow === null) createWindow(); });
