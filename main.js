const {app, BrowserWindow} = require('electron');
const fs = require('fs');
var mainWindow = null;

app.on('window-all-closed', function() {
  var size = mainWindow.getContentSize();
  var width = size[0];
  var height = size[1];
  var obj = {width: width, height: height};
  var objStr = JSON.stringify(obj);
  fs.writeFileSync(__dirname + '/save/window_size.json', objStr);
  app.quit();
});

app.on('ready', function() {
  fs.readFile(__dirname + '/save/window_size.json', function(err, size) {
    size = JSON.parse(size);
    console.log(size);
    mainWindow = new BrowserWindow({width: size.width, height: size.height});
    mainWindow.setContentSize(size.width, size.height);
    console.log('file://' + __dirname + '/browser/browser.html');
    mainWindow.loadURL('file://' + __dirname + '/browser/browser.html');
  });
  //mainWindow.openDevTools();
});
