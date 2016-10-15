const electron = require('electron');
const {ipcMain, BrowserWindow, app} = require('electron');
const Configstore = require('configstore');
const conf = new Configstore(app.getName());

module.exports = function(){
  var module = {};
  module.GitWindow = {
    create: function(){
      var primaryDisplay = electron.screen.getPrimaryDisplay();
      var gitWindow = new BrowserWindow({
        width: 820,
        height: 430,
        icon: __dirname + '/assets/app_icon.png',
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
      console.log(`file://${__dirname}/git.html`);
      gitWindow.loadURL(`file://${__dirname}/git.html`);

      ipcMain.on('set-git-url', function(event, gitUrl){
        conf.set('giturl', gitUrl);
        callback();
        gitWindow.hide();
      });
    }
  };
  return module;
};
