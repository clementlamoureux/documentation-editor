const electron = require('electron');
const {app, Menu} = require('electron');
var i18n = require('../locales/fr_FR.json');

module.exports = {
  init : function(mainWindow, GitWindow, start){
    const template = [
      {
        label: i18n.MENU.FILE.TITLE,
        submenu: [
          {
            label: 'Changer de dépôt Git',
            role: 'git',
            click: function () {
              mainWindow.hide();
              GitWindow.create(start);
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
        label: i18n.MENU.ABOUT.HELP,
        submenu: [
          {
            label: i18n.MENU.ABOUT.DEV_TOOLS,
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
  }
};
