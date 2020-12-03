import electron from 'electron';
import path from 'path';
import url from 'url';
import 'babel-polyfill';

const log = require('electron-log');
log.transports.file.file = path.join(__dirname, '../.electron-log.txt');
log.transports.file.getFile().clear();

import TrayIcon from './tray';
import { variables } from 'electron-log';

const { app, ipcMain, BrowserWindow } = electron;

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
  
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, '../src/assets', iconName);
  tray = new TrayIcon(iconPath, mainWindow);
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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
