const {Menu} = require('electron');
const electron = require('electron');
const app = electron.app;
const {Notifications} = require('./settings');
const Configstore = require('configstore');
// const pkg = require('./../package.json');
const conf = new Configstore(app.getName(), {version: app.getVersion()});
var i18n = require('./locales/fr_FR.json');

module.exports = function (autoUpdater, app) {
  var module = {};
  var menu = process.platform !== 'darwin' ? [
    {
      label: i18n.CONTEXTMENU.SHOW_NOTIFS,
      type: 'checkbox',
      checked: Notifications.get(),
      click: function () {
        Notifications.toggle();
      }
    },
    {
      label: i18n.CONTEXTMENU.HIDE,
      type: 'normal',
      click: function () {
        module.BagooContextConfig.mainWindow.hide();
      }
    },
    {
      label: i18n.CONTEXTMENU.SHOW,
      type: 'normal',
      click: function () {
        module.BagooContextConfig.mainWindow.show();
      }
    }] : [
    {
      label: i18n.MENU.WINDOW.CONTEXT_TITLE,
      submenu: [
        {
          label: i18n.MENU.WINDOW.RELOAD,
          role: 'Rafraîchir',
          accelerator: process.platform === 'darwin' ? 'Command+R' : 'F5',
          click: function () {
            module.BagooContextConfig.mainWindow.reload();
          }
        },
        {
          label: i18n.MENU.WINDOW.FULLSCREEN,
          role: 'Plein écran',
          accelerator: 'F11',
          click: function () {
            module.BagooContextConfig.mainWindow.setFullScreen(!module.BagooContextConfig.mainWindow.isFullScreen());
          }
        },
        {
          label: i18n.MENU.WINDOW.MAXIMIZE,
          role: 'Maximiser',
          click: function () {
            module.BagooContextConfig.mainWindow.maximize();
          }
        },
        {
          label: i18n.MENU.WINDOW.ALWAYS_TOP,
          role: 'Toujours devant',
          type: 'checkbox',
          click :function(menuItem) {
            module.BagooContextConfig.mainWindow.setAlwaysOnTop(menuItem.checked);
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
            module.BagooContextConfig.mainWindow.webContents.openDevTools();
            if(module.BagooContextConfig.popupWindow && !module.BagooContextConfig.popupWindow.isDestroyed()){
              module.BagooContextConfig.popupWindow.webContents.openDevTools();
            }
          }
        },
        {
          label: i18n.CONTEXTMENU.UPDATE,
          role: 'Mise à jour',
          click: function () {
            const version = app.getVersion();
            const platform = process.platform === 'darwin' ? 'osx' : process.platform;
            const url = `https://studio.raccourci.fr/preprod/api/electron/update/beta-console-bagoo/${platform}/${version}`;
            autoUpdater.setFeedURL(url);
            autoUpdater.checkForUpdates();

            autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
              var index = dialog.showMessageBox(module.BagooContextConfig.mainWindow, {
                type: 'info',
                buttons: [i18n.CONTEXTMENU.RESTART, i18n.CONTEXTMENU.LATER],
                title: "Typetalk",
                message: i18n.CONTEXTMENU.NEW_VERSION,
                detail: releaseName + "\n\n" + releaseNotes
              });
              if (index === 1) {
                return;
              }
              quitAndUpdate();
            });
          }
        }
      ]
    }];
  menu.push({
    type: 'separator'
  });
  menu.push({
    type: 'normal',
    label: 'Console Bagoo ' + app.getVersion(),
    enabled: false
  });
  module.BagooContextConfig = {};
  module.BagooContextMenu = Menu.buildFromTemplate(menu);

  return module;
};