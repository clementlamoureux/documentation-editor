const electron = require('electron');
const {ipcMain, BrowserWindow, app} = require('electron');
const Configstore = require('configstore');
const conf = new Configstore(app.getName());
const exec = require('child_process').exec;
const {GitWindow} = require('./gitWindow')();


module.exports = function(){
  var module = {};
  module.GitLoader = {
    create: function(configFolder, gitUrl, localGitUrl, start, callback){
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
      exec('rm -rf ' + localGitUrl + ' && git clone ' + gitUrl + " " + localGitUrl, function(error){
        loaderWindow.hide();
        if(error){
          return GitWindow.create(start);
        }
        callback();
      });
    }
  };
  return module;
};
