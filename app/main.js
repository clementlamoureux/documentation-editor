// ELECTRON DEPENDENCIES
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Tray, Menu, dialog, ipcMain} = require('electron');
const renderer = require('./renderer');
var request = require('request');
var log = require('electron-log');
const Configstore = require('configstore');
var fs = require('fs');
var i18n = require('./src/locales/fr_FR.json');

var configFolder = app.getPath('temp');
const exec = require('child_process').exec;
exec('git clone git@gitlab.raccourci.dev:documentation/documentation.git ' + configFolder + '/documentation-editor/');

function createWindow () {
  var scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor;
  var primaryDisplay = electron.screen.getPrimaryDisplay();
  var mainWindow = new BrowserWindow({
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

  const template = [
    {
      label: i18n.MENU.FILE.TITLE,
      submenu: [
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
          role: 'Plein écran (F11)',
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
            if (module.BagooMenuConfig.popupWindow && !module.BagooMenuConfig.popupWindow.isDestroyed() && module.BagooMenuConfig.popupWindow.webContents) {
              module.BagooMenuConfig.popupWindow.webContents.openDevTools();
            }
          }
        },
        {
          label: i18n.MENU.HELP.RESET,
          role: 'Reset data',
          click: function () {
            log.info('FLUSHING Storage bagoo...');
            mainWindow.webContents.session.clearStorageData(
              {
                origin: 'http://bagoo.rc-preprod.com',
                storages: ['cookies', 'local storage']
              },
              function () {
                log.info('FLUSHING Storage bagoo...OK');
                log.info('FLUSHING Storage Studio...');
                mainWindow.webContents.session.clearStorageData(
                  {
                    origin: 'http://connect.studio.rc-preprod.com',
                    storages: ['cookies', 'local storage']
                  },
                  function () {
                    log.info('FLUSHING Storage Studio...OK');
                    app.quit()
                  }
                );
              }
            );

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
    var text = fs.readFileSync(configFolder + '/documentation-editor/' + fileName,'utf8');
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
  ipcMain.on('save-file', function(event, fileName, data){
    console.log('save' , configFolder + '/documentation-editor/' + fileName);
      fs.writeFile(configFolder + '/documentation-editor/' + fileName, data, function(){
        exec('git add --all && git commit -m "Update ' + fileName + '" && git push');
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
