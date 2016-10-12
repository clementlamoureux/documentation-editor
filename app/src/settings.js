const Configstore = require('configstore');
const pkg = require('./../package.json');
const conf = new Configstore(pkg.name, {version: pkg.version});

module.exports = function (a) {
  var module = {};
  if(conf.get('notif') === undefined){
    conf.set('notif', true);
  }
  module.Notifications = {
    "enable":function(){
      conf.set('notif', true);
      module.Notifications.mainWindow.webContents.executeJavaScript("window.Notification = window.oldNotification;");
    },
    "disable":function(){
      conf.set('notif', false);
      module.Notifications.mainWindow.webContents.executeJavaScript("window.oldNotification = window.Notification; window.Notification = function(){return console.warn('notifications are disabled')};");
    },
    "toggle":function(){
      module.Notifications.get() ? module.Notifications.disable() : module.Notifications.enable()
    },
    "get":function(){
      return conf.get('notif');
    },
    "apply":function(mainWindow){
      module.Notifications.mainWindow = mainWindow;
      if(!module.Notifications.get()){
        module.Notifications.mainWindow.webContents.executeJavaScript("window.oldNotification = window.Notification; window.Notification = function(){return console.warn('notifications are disabled')};");
      }
    }
  };
  module.Modules = {
    "apply": function(mainWindow){
      module.Notifications.apply(mainWindow);
    }
  };
  return module;
}();
