const { app, BrowserWindow } = require('electron');
const path = require('path');

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Phần Mềm Quản Lý Chấm Công',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Start NestJS server
  try {
    console.log('Starting NestJS server...');
    require('./backend/dist/main.js');
    console.log('NestJS server started successfully.');
    
    // Give it a moment to bind to the port
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3002');
    }, 1500);
  } catch (error) {
    console.error('Failed to start NestJS server:', error);
    // If it fails (maybe port in use), we just load the URL anyway
    mainWindow.loadURL('http://localhost:3002');
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
