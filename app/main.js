// ELECTRON DEPENDENCIES
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Tray, Menu, dialog, ipcMain, protocol} = require('electron');
const renderer = require('./renderer');
var request = require('request');
var log = require('electron-log');
const Configstore = require('configstore');
const conf = new Configstore(app.getName());
var fs = require('fs');
app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--disable-gpu');
const exec = require('child_process').exec;
const {GitWindow} = require('./src/modules/gitWindow')();
const {GitLoader} = require('./src/modules/gitLoader')();
const menu = require('./src/modules/menu');

const configFolder = app.getPath('temp');
const gitUrl = conf.get('giturl');
const localGitUrl = configFolder + '/documentation-editor-data/';

// START

var start = function(){
  if(conf.get('giturl') === undefined){
    GitWindow.create(start);
  }
  else{
    GitLoader.create(configFolder, gitUrl, localGitUrl, start, function(){
      createMainWindow();
    });
  }
};


function createMainWindow () {
  var scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor;
  var primaryDisplay = electron.screen.getPrimaryDisplay();
  var mainWindow = new BrowserWindow({
    width: primaryDisplay.width * scaleFactor,
    height: primaryDisplay.height * scaleFactor,
    x:0,
    y:0,
    minWidth: primaryDisplay.width * scaleFactor,
    minHeight: primaryDisplay.height * scaleFactor,
    icon: __dirname + '/src/assets/app_icon.png',
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  mainWindow.loadURL(`file://${__dirname}/index.html#/`);
  menu.init(mainWindow, GitWindow, start);


  ipcMain.on('read-file', function(event, fileName){
    var text = fs.readFileSync(localGitUrl + fileName,'utf8');
    event.sender.send('message', {type: 'read-file', data: text, metadata: {name: fileName}});

  });
  ipcMain.on('upload-file', function(event, pathToFile){
    var req = request.post('https://vgy.me/upload', function (err, resp, body) {
      if (err) {
      } else {
        event.sender.send('message', {type: 'upload-file', data: body, metadata: {name: pathToFile}});
      }
    });
    var form = req.form();
    form.append('file', fs.createReadStream(pathToFile));
  });
  ipcMain.on('list-files', function(event){
    var tmp = [];
    fs.readdir(localGitUrl, function(err, items) {
      for (var i=0; i<items.length; i++) {
        if(items[i].indexOf('.md') > -1){
          tmp.push(items[i]);
        }
      }
      event.sender.send('message', {type: 'list-files', data: tmp});
    });
  });
  ipcMain.on('save-file', function(event, fileName, data){
      fs.writeFile(localGitUrl + fileName, data, function(){
        exec('cd ' + localGitUrl + ' && git add --all && git commit -m "Update ' + fileName + '" && git push');
      });
  });
  const filter = {
    urls: ['*']
  };
  mainWindow.webContents.session.webRequest.onBeforeRequest(filter, function(request, callback){
    if(request.resourceType === 'image' && request.url.indexOf(__dirname) > -1){
      var tmp = request.url.replace('file:///home/clement/dev/documentation/documentation-editor/app/', localGitUrl);
      tmp = 'file://' + tmp;
    }
    callback({cancel: false, redirectURL: tmp});
  });
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

app.on('ready', start);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow();

  }
});
