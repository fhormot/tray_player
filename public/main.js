import electron, { globalShortcut } from 'electron';
import path from 'path';
import url from 'url';
import 'babel-polyfill';

const log = require('electron-log');

const youtubedl = require('youtube-dl');
const yts = require('yt-search');

log.transports.file.file = path.join(__dirname, './.electron-log.txt');
log.transports.file.getFile().clear();

import MainWindow from './main_window';
import TrayIcon from './tray_icon';

const { app, ipcMain } = electron;

let mainWindow;
let tray;

const createWindow = () => {
  if(process.platform === 'darwin'){
    app.dock.hide();
  }

  const urlPath = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow = new MainWindow(urlPath);

  globalShortcut.register('CommandOrControl+Shift+F9', () => mainWindow.webContents.send('control:playback'));
  globalShortcut.register('CommandOrControl+Shift+F10', () => mainWindow.webContents.send('control:next'));
  globalShortcut.register('CommandOrControl+Shift+F11', () => mainWindow.webContents.send('control:back'));
  globalShortcut.register('CommandOrControl+Shift+F12', () => mainWindow.webContents.send('control:mute'));

  // TODO: Add process.env to control this feature
  globalShortcut.register('CommandOrControl+Shift+R', () => mainWindow.loadURL(urlPath));

  mainWindow.on('closed', () => {
    globalShortcut.unregisterAll();

    mainWindow = null;
  });

  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, './assets', iconName);// ./assets with respect to the app folder

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

ipcMain.on('youtube-dl:metadata', (event, url) => {
  // log.info("getting info");
  youtubedl.getInfo(url, (err, info) => {
    if(!err){
      log.info(info);
      mainWindow.webContents.send('youtube-dl:metadata', {
        title: info.title
      });
    } else {
      log.info(err);
    }
  });
});

ipcMain.on('search:query', async (event, query) => {
  const resp = await yts(query);
  log.info(resp.all);

  mainWindow.webContents.send('search:query', resp.all);
});
