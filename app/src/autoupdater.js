const {autoUpdater} = require('electron');
module.exports = function(){
  var module = {};
  module.electronAutoUpdater = autoUpdater;
  module.AutoUpdater = function(){
    if(env !== 'dev'){
      if(process.platform === 'darwin' || process.platform === 'win32') {

        const version = app.getVersion();
        const platform = process.platform === 'darwin' ? 'osx' : process.platform;
        const url = `https://studio.raccourci.fr/preprod/api/electron/update/beta-console-bagoo/${platform}/${version}`;

        try {
          autoUpdater.setFeedURL(url);
          autoUpdater.checkForUpdates();
        } catch (error) {
        }

        autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
          var index = dialog.showMessageBox(mainWindow, {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: "Typetalk",
            message: 'The new version has been downloaded. Please restart the application to apply the updates.',
            detail: releaseName + "\n\n" + releaseNotes
          });
          if (index === 1) {
            return;
          }
          quitAndUpdate();
        });
      }
    }
  };
  return module;
};
