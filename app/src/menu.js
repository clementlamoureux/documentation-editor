const {Menu} = require('electron');
var i18n = require('./locales/fr_FR.json');
module.exports = function (app, log, dialog) {
  var module = {};
  module.BagooMenuConfig = {};
  const template = [
    {
      label: i18n.MENU.FILE.TITLE,
      submenu: [
        {
          label: i18n.MENU.FILE.EXIT,
          role: 'Quitter',
          click: function () {
            module.BagooMenuConfig.mainWindow.close();
          }
        }
      ]
    },
    {
      label: i18n.MENU.ACCOUNT.TITLE,
      submenu: [
        {
          label: i18n.MENU.ACCOUNT.MY_ACCOUNT,
          role: 'Mon compte',
          click: function () {
            module.BagooMenuConfig.mainWindow.loadURL(mainURL + '#/account');
          }
        },
        {
          label: i18n.MENU.ACCOUNT.LOGOUT,
          role: 'Se déconnecter',
          click: function () {
            module.BagooMenuConfig.mainWindow.loadURL(mainURL + '#/login');
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
            module.BagooMenuConfig.mainWindow.reload();
          }
        },
        {
          label: i18n.MENU.WINDOW.FULLSCREEN,
          role: 'Plein écran (F11)',
          accelerator: 'F11',
          click: function () {
            module.BagooMenuConfig.mainWindow.setFullScreen(!module.BagooMenuConfig.mainWindow.isFullScreen());
          }
        },
        {
          label: i18n.MENU.WINDOW.MAXIMIZE,
          role: 'Maximiser',
          click: function () {
            module.BagooMenuConfig.mainWindow.maximize();
          }
        },
        {
          label: i18n.MENU.WINDOW.ALWAYS_TOP,
          role: 'Toujours devant',
          type: 'checkbox',
          click: function (menuItem) {
            module.BagooMenuConfig.mainWindow.setAlwaysOnTop(menuItem.checked);
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
            module.BagooMenuConfig.mainWindow.webContents.openDevTools();
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
            module.BagooMenuConfig.mainWindow.webContents.session.clearStorageData(
              {
                origin: 'http://bagoo.rc-preprod.com',
                storages: ['cookies', 'local storage']
              },
              function () {
                log.info('FLUSHING Storage bagoo...OK');
                log.info('FLUSHING Storage Studio...');
                module.BagooMenuConfig.mainWindow.webContents.session.clearStorageData(
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
            var index = dialog.showMessageBox(module.BagooMenuConfig.mainWindow, {
              type: 'info',
              buttons: ['ok'],
              title: "Console Bagoo",
              message: 'VERSION: ' + app.getVersion(),
              detail: "\nRaccourci Interactive 2016\n"
            });
            if (index === 1) {
              return true;
            }
          }
        }
      ]
    }];

  if (process.platform == 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        },
      ]
    });
  }
  module.BagooMenu = Menu.buildFromTemplate(template);
  return module;
};
