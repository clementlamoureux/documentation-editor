// ELECTRON DEPENDENCIES
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Tray, Menu, dialog} = require('electron');
const renderer = require('./renderer');
var log = require('electron-log');
const Configstore = require('configstore');

var Git = require("nodegit");
var fs = require("fs");

console.log(app.getPath('userData'));

function createWindow () {
  var scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor;
  var primaryDisplay = electron.screen.getPrimaryDisplay();
  mainWindow = new BrowserWindow({
    width: primaryDisplay.width * scaleFactor,
    height: primaryDisplay.height * scaleFactor,
    x:0,
    y:0,
    minWidth: primaryDisplay.width * scaleFactor,
    minHeight: primaryDisplay.height * scaleFactor,
    icon: __dirname + '/src/assets/bagoo-32.png',
    center: true,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false
    }
  });
  console.log(`file://${__dirname}/index.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.maximize();

  mainWindow.on('hide', function(){
  });
  mainWindow.on('show', function(){
  });
  mainWindow.on('minimize', function(){
  });
  mainWindow.on('restore', function(){
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();

  }
});
