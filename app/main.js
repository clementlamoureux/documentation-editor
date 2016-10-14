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
var i18n = require('./src/locales/fr_FR.json');
var configFolder, gitUrl, localGitUrl;
app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--disable-gpu');
const exec = require('child_process').exec;

// START

var start = function(){
  if(conf.get('giturl') === undefined){
    createGitWindow();
  }
  else{
    loadGit(function(){
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

  const template = [
    {
      label: i18n.MENU.FILE.TITLE,
      submenu: [
        {
          label: 'Changer de dépôt Git',
          role: 'git',
          click: function () {
            mainWindow.hide();
            createGitWindow();
          }
        },
        {
          type: 'separator'
        },
        {
          label: i18n.MENU.FILE.EXIT,
          role: 'Quitter',
          click: function () {
            mainWindow.close();
          }
        }
      ]
    },
    {
      label: i18n.MENU.WINDOW.TITLE,
      submenu: [
        {
          label: i18n.MENU.WINDOW.RELOAD,
          role: 'Rafraîchir (F5)',
          accelerator: 'F5',
          click: function () {
            mainWindow.reload();
          }
        },
        {
          label: i18n.MENU.WINDOW.FULLSCREEN,
          role: 'Plein écran',
          accelerator: 'F11',
          click: function () {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        {
          label: i18n.MENU.WINDOW.MAXIMIZE,
          role: 'Maximiser',
          click: function () {
            mainWindow.maximize();
          }
        },
        {
          label: i18n.MENU.WINDOW.ALWAYS_TOP,
          role: 'Toujours devant',
          type: 'checkbox',
          click: function (menuItem) {
            mainWindow.setAlwaysOnTop(menuItem.checked);
          }
        }
      ]
    },
    {
      label: i18n.MENU.HELP.TITLE,
      submenu: [
        {
          label: i18n.MENU.HELP.DEV_TOOLS,
          role: 'Console développeur',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'F12',
          click: function () {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: i18n.MENU.ABOUT.TITLE,
          role: 'Version',
          click: function () {
            var index = dialog.showMessageBox(mainWindow, {
              type: 'info',
              buttons: ['ok'],
              title: "Documentation Editor",
              message: 'VERSION: ' + app.getVersion(),
              detail: "\nclementlamoureux@gmail.com 2016\n"
            });
            if (index === 1) {
              return true;
            }
          }
        }
      ]
    }];
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);


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
  ipcMain.on('list-files', function(event, fileName){
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
    if(request.resourceType === 'image' && request.url.indexOf('file:///home/clement/dev/documentation/documentation-editor/app/') > -1){
      var toto = request.url.replace('file:///home/clement/dev/documentation/documentation-editor/app/', localGitUrl);
      toto = 'file://' + toto;
      console.log(toto);
    }
    callback({cancel: false, redirectURL: toto});
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

function createGitWindow() {
  var primaryDisplay = electron.screen.getPrimaryDisplay();
  var gitWindow = new BrowserWindow({
    width: 820,
    height: 430,
    icon: __dirname + '/src/assets/app_icon.png',
    frame: false,
    resizable: false,
    transparent: true,
    x: primaryDisplay.bounds.width / 2 - 410,
    y: primaryDisplay.bounds.height / 2 - 215,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  gitWindow.loadURL(`file://${__dirname}/git.html`);



  ipcMain.on('set-git-url', function(event, gitUrl){
    conf.set('giturl', gitUrl);
    start();
    gitWindow.hide();
  });
}

function loadGit(callback) {

  var scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor;
  if(scaleFactor > 1){
    scaleFactor--;
  }
  var primaryDisplay = electron.screen.getPrimaryDisplay();
  var loaderWindow = new BrowserWindow({
    width: 80,
    height: 80,
    icon: __dirname + '/src/assets/app_icon.png',
    x: primaryDisplay.bounds.width / 2 - 40,
    y: primaryDisplay.bounds.height / 2 - 40,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  loaderWindow.loadURL(`file://${__dirname}/loader.html`);
  configFolder = app.getPath('temp');
  gitUrl = conf.get('giturl');
  localGitUrl = configFolder + '/documentation-editor/';
  exec('rm -rf ' + localGitUrl + ' && git clone ' + gitUrl + " " + localGitUrl, function(){
    loaderWindow.hide();
    callback();
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
