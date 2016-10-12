// ELECTRON DEPENDENCIES
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Tray, Menu, dialog} = require('electron');
const renderer = require('./renderer');
var log = require('electron-log');
const Configstore = require('configstore');
// const pkg = require('./../package.json');
const conf = new Configstore(app.getName(), {version: app.getVersion()});

// PROJECT DEPENDENCIES
var mainWindow, popupWindow;
var {BagooMenu, BagooMenuConfig} = require(__dirname + '/src/menu')(app, log, dialog);
var {AutoUpdater, electronAutoUpdater} = require(__dirname + '/src/autoupdater');
var {Modules} = require(__dirname + '/src/settings');
var {BagooContextMenu, BagooContextConfig} = require(__dirname + '/src/contextmenu')(electronAutoUpdater, app);

// MENU INITIALIZATION
Menu.setApplicationMenu(BagooMenu);

// CONSTANTS
var env = process.env.NODE_ENV;
var mainURL = env === 'dev' ? 'http://localhost:3000/' : 'http://bagoo.rc-preprod.com/admin';
const options = {extraHeaders: 'pragma: no-cache\n'};

// CHROMIUM OPTIONS
app.commandLine.appendSwitch('--ignore-certificate-errors');
app.commandLine.appendSwitch('--disable-http-cache');


function setContextToComponents (){
  BagooContextConfig.mainWindow = mainWindow;
  BagooMenuConfig.mainWindow = mainWindow;
  BagooContextConfig.popupWindow = popupWindow;
  BagooMenuConfig.popupWindow = popupWindow;
}

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

  mainWindow.loadURL(mainURL + '', options);

  log.info('[FLUSHING] Storage Bagoo...');
  mainWindow.webContents.session.clearStorageData(
    {
      origin: 'http://bagoo.rc-preprod.com',
      storages: ['cookies', 'local storage']
    },
    function(){
      log.info('[FLUSHING] Storage Bagoo...OK');
      log.info('[FLUSHING] Storage Studio...');
      mainWindow.webContents.session.clearStorageData(
        {
          origin: 'http://connect.studio.rc-preprod.com',
          storages: ['cookies', 'local storage']
        },
        function(){
          log.info('[FLUSHING] Storage Studio...OK');
        }
      );
    }
  );

  tray = new Tray(process.platform === 'darwin' ?  __dirname + '/src/assets/' + 'icon_16x16@2x.png' :  __dirname + '/src/assets/' + 'bagoo.png');
  tray.setToolTip('Bagoo');
  tray.setContextMenu(BagooContextMenu);

  mainWindow.webContents.on('did-finish-load', function(){
    Modules.apply(mainWindow);
  });

  mainWindow.webContents.on('new-window', function(a, b){
    a.preventDefault();
    // log.info(a, b);
    var scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor - 1;
    console.log(scaleFactor);
    var primaryDisplay = electron.screen.getPrimaryDisplay();
    var width = ((primaryDisplay.bounds.width * 2) / 3) * scaleFactor;
    var height = ((primaryDisplay.bounds.height * 2) / 3) * scaleFactor;
    var params = {
      width: width,
      height: height,
      parent: mainWindow,
      x: ((primaryDisplay.bounds.width - width) / 2) * scaleFactor,
      y: ((primaryDisplay.bounds.height - height) / 2) * scaleFactor,
      frame: false,
      resizable: false,
      thickFrame: false
    };
    popupWindow = new BrowserWindow(params);
    popupWindow.loadURL(b);
    popupWindow.webContents.on('will-navigate', function(event, newUrl){
      popupWindow.loadURL(newUrl);
      log.info(newUrl);
    });
    mainWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl){
      // popupWindow.loadURL(newUrl);
      // log.info(newUrl);
    });
    popupWindow.webContents.on('close', function(){
      if(mainWindow){
        mainWindow.loadURL(mainURL);
      }
    });
    setContextToComponents();
  });

  mainWindow.maximize();

  mainWindow.on('hide', function(){
    if(popupWindow && !popupWindow.isDestroyed()){
      popupWindow.hide();
    }
  });
  mainWindow.on('show', function(){
    if(popupWindow && !popupWindow.isDestroyed()){
      popupWindow.show();
    }
  });
  mainWindow.on('minimize', function(){
    if(popupWindow && !popupWindow.isDestroyed()){
      popupWindow.minimize();
    }
  });
  mainWindow.on('restore', function(){
    if(popupWindow && !popupWindow.isDestroyed()){
      popupWindow.restore();
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });
  setContextToComponents();
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
