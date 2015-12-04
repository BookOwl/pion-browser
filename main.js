var app = require('app');
var fs = require('fs');
var BrowserWindow = require('browser-window');
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
    mainWindow = new BrowserWindow({width: size.width, height: size.height});
    mainWindow.loadUrl('file://' + __dirname + '/browser/browser.html');
  });
  //mainWindow.openDevTools();
});
