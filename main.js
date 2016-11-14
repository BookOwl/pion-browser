const {app, BrowserWindow} = require('electron');
const fs = require('fs');
let mainWindow = null;

if (process.platform == 'darwin') {
  app.setAboutPanelOptions({
    applicationName: app.getName(),
    applicationVersion: app.getVersion(),
    copyright: "Released under the MIT license"
  })
}
app.on('window-all-closed', function() {
  const size = mainWindow.getContentSize();
  const width = size[0];
  const height = size[1];
  const obj = {width: width, height: height};
  const objStr = JSON.stringify(obj);
  fs.writeFileSync(__dirname + '/save/window_size.json', objStr);
  app.quit();
});

app.on('ready', function() {
  fs.readFile(__dirname + '/save/window_size.json', function(err, cont) {
    const size = err ? {width:800, height: 600} : JSON.parse(cont);
    mainWindow = new BrowserWindow({width: size.width, height: size.height});
    mainWindow.setContentSize(size.width, size.height);
    mainWindow.loadURL('file://' + __dirname + '/browser/browser.html');
  });
});
