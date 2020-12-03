import electron from 'electron';
import path from 'path';
import url from 'url';
import 'babel-polyfill';

import TrayIcon from './tray';

const { app, ipcMain, BrowserWindow, Tray } = electron;

let mainWindow;
let tray;

const createWindow = () => {
  const windowWidth = 250;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: 1.6*windowWidth,
    webPreferences: {
      nodeIntegration: true
    },
    movable: false,
    resizable: false,
    frame: false,
    show: false
  });

  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const iconName = process.platform === 'win32' ? 'windows-icon@2x.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`);

  // tray = new Tray(iconPath);
  tray = new TrayIcon(iconPath, mainWindow);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
