// ELECTRON DEPENDENCIES
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Tray, Menu, dialog, ipcMain} = require('electron');
const renderer = require('./renderer');
var log = require('electron-log');
const Configstore = require('configstore');
var fs = require('fs');

var configFolder = app.getPath('temp');
const exec = require('child_process').exec;
exec('git clone git@gitlab.raccourci.dev:documentation/documentation.git ' + configFolder + '/documentation-editor/');

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
      nodeIntegration: true,
      webSecurity: false
    }
  });
  console.log(`file://${__dirname}/index.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html#/`);

  var contents = mainWindow.webContents;
  mainWindow.toggleDevTools();



  ipcMain.on('read-file', function(event, fileName){
    var text = fs.readFileSync(configFolder + '/documentation-editor/' + fileName,'utf8');
    event.sender.send('message', {type: 'read-file', data: text, metadata: {name: fileName}});

  });
  ipcMain.on('list-files', function(event, fileName){
    var tmp = [];
    fs.readdir(configFolder + '/documentation-editor/', function(err, items) {
      for (var i=0; i<items.length; i++) {
        if(items[i].indexOf('.md') > -1){
          tmp.push(items[i]);
        }
      }
      console.log(tmp);
      event.sender.send('message', {type: 'list-files', data: tmp});
    });
  });

  setTimeout(function(){
  }, 2000);

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
