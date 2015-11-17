var remote = require('remote');
window.onresize = doLayout;
var isLoading = false;
var webview;

onload = function() {
  webview = document.querySelector('webview');
  doLayout();

  document.querySelector('#back').onclick = function() {
    webview.goBack();
  };

  document.querySelector('#forward').onclick = function() {
    webview.goForward();
  };

  document.querySelector('#home').onclick = function() {
    navigateTo('file:../home/home.html');
  };

  document.querySelector('#reload').onclick = function() {
    if (isLoading) {
      webview.stop();
    } else {
      webview.reload();
    }
  };
  document.querySelector('#reload').addEventListener(
    'webkitAnimationIteration',
    function() {
      if (!isLoading) {
        document.body.classList.remove('loading');
      }
    });

  document.querySelector('#location-form').onsubmit = function(e) {
    e.preventDefault();
    navigateTo(document.querySelector('#location').value);
  };

  webview.addEventListener('close', handleExit);
  webview.addEventListener('did-start-loading', handleLoadStart);
  webview.addEventListener('did-stop-loading', handleLoadStop);
  webview.addEventListener('did-fail-load', handleLoadAbort);
  webview.addEventListener('did-get-redirect-request', handleLoadRedirect);
  webview.addEventListener('did-finish-load', handleLoadCommit);
  webview.addEventListener('new-window', function(e) {
    webview.src = e.url;
  });
  webview.addEventListener('close', function() {
    webview.src = 'about:blank';
  });
  
  createMenus();
};

function navigateTo(url) {
  resetExitedState();
  var r = /^.+?:/;
  if (r.test(url)){
    document.querySelector('webview').src = url;
  } else {
    document.querySelector('webview').src = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
  }
}

function doLayout() {
  var webview = document.querySelector('webview');
  var controls = document.querySelector('#controls');
  var controlsHeight = controls.offsetHeight;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var webviewWidth = windowWidth;
  var webviewHeight = windowHeight - controlsHeight;

  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';

  var sadWebview = document.querySelector('#sad-webview');
  sadWebview.style.width = webviewWidth + 'px';
  sadWebview.style.height = webviewHeight * 2/3 + 'px';
  sadWebview.style.paddingTop = webviewHeight/3 + 'px';
}

function handleExit(event) {
  console.log(event.type);
  document.body.classList.add('exited');
  if (event.type == 'abnormal') {
    document.body.classList.add('crashed');
  } else if (event.type == 'killed') {
    document.body.classList.add('killed');
  }
}

function resetExitedState() {
  document.body.classList.remove('exited');
  document.body.classList.remove('crashed');
  document.body.classList.remove('killed');
}

function handleKeyDown(event) {}

function handleLoadCommit() {
  resetExitedState();
  var webview = document.querySelector('webview');
  document.querySelector('#location').value = webview.getUrl();
  document.querySelector('#back').disabled = !webview.canGoBack();
  document.querySelector('#forward').disabled = !webview.canGoForward();
  remote.getCurrentWindow().setTitle('Pion: ' + webview.getTitle());
}

function handleLoadStart(event) {
  document.body.classList.add('loading');
  isLoading = true;

  resetExitedState();
  if (!event.isTopLevel) {
    return;
  }

  document.querySelector('#location').value = event.url;
}

function handleLoadStop(event) {
  // We don't remove the loading class immediately, instead we let the animation
  // finish, so that the spinner doesn't jerkily reset back to the 0 position.
  isLoading = false;
}

function handleLoadAbort(event) {
  console.log('LoadAbort');
  console.log('  url: ' + event.url);
  console.log('  isTopLevel: ' + event.isTopLevel);
  console.log('  type: ' + event.type);
}

function handleLoadRedirect(event) {
  resetExitedState();
  document.querySelector('#location').value = event.newUrl;
}

function createMenus(){
  var Menu = remote.require('menu');
  var MenuItem = remote.require('menu-item');
  
  var cmenu = new Menu();
  cmenu.append(new MenuItem({ 
                                label: 'Copy',
                                role: 'copy',
                                accelerator: 'CmdOrCtrl+c'
  }));
  cmenu.append(new MenuItem({ 
                                label: 'Cut',
                                role: 'cut',
                                accelerator: 'CmdOrCtrl+x'
  }));
  cmenu.append(new MenuItem({ 
                                label: 'Paste',
                                role: 'paste',
                                accelerator: 'CmdOrCtrl+v'
  }));
  cmenu.append(new MenuItem({ 
                                label: 'Select All',
                                role: 'selectall',
                                accelerator: 'CmdOrCtrl+a'
  }));
  window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    cmenu.popup(remote.getCurrentWindow());
  }, false);
  
  var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function() { webview.reload(); }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
  {
    label: 'Dev Tools',
    submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function() {
            if (webview.isDevToolsOpened()){
              webview.closeDevTools();
            } else {
              webview.openDevTools();
            }
          }
        },
        {
          label: 'Toggle Pion Dev Tools',
          click: function() { remote.getCurrentWindow().toggleDevTools(); }
        },
    ]
  },
  {
    label: 'Quick Links',
    submenu: [
      {
        label: 'Scratch',
        accelerator: 'CmdOrCtrl+Alt+S',
        click: function() { navigateTo('https://scratch.mit.edu'); }
      },
      {
        label: 'Github',
        accelerator: 'CmdOrCtrl+Alt+G',
        click: function() { navigateTo('https://github.com'); }
      },
      {
        label: 'MDN',
        accelerator: 'CmdOrCtrl+Alt+M',
        click: function() { navigateTo('https://developer.mozilla.org/en-US/'); }
      },
      {
        label: 'Wikipedia',
        accelerator: 'CmdOrCtrl+Alt+W',
        click: function() { navigateTo('http://en.wikipedia.org/wiki/Main_Page'); }
      },
    ]
  }
];
  if (process.platform == 'darwin') {
  var name = require('app').getName();
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
        click: function() { app.quit(); }
      },
    ]
  });
  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  );
}
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}