var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
//var updater = require('electron-updater');
// Report crashes to our server.
require('crash-reporter').start();
var Menu = require("menu");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

//kmm
// On the main process.
var window = null;

//KMM
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
//kmm
  // window = new BrowserWindow({width: 800, height: 600});
  // window.loadUrl('http://arrrowhorn-email.com/wp/demo.html');
  // window.webContents.on('did-finish-load', function() {
  //   window.webContents.send('ping', 'whoooooooh!');
  //   console.log('getting title of page');
  //   console.log(window.webContents.getTitle());
  //   // use electron --debug=5858 main.js to debug main.js
  //   if (window.webContents.getTitle() === 'Version 0.0.5') {
  //     console.log('new update is not needed');
  //   } else {
  //     console.log('download the new payload, quit the app and restart??')
  //     mainWindow = new BrowserWindow({
  //       width: 800,
  //       height: 600
  //     });
  //
  //     // and load the index.html of the app.
  //     mainWindow.loadUrl('file://' + __dirname + '/update.html');
  //     //app.quit();
  //   }
  // });

  //KMM
    // Create the browser window.
    console.log('the updater says you are ready!');
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
//   mainWindow.loadUrl('http://arrrowhorn-email.com/wp/demo.html');

    // Open the devtools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });



  // Create the Application's main menu
  var template = [{
    label: "Application",
    submenu: [{
      label: "About Application",
      selector: "orderFrontStandardAboutPanel:"
    }, {
      type: "separator"
    }, {
      label: "Quit",
      accelerator: "Command+Q",
      click: function() {
        app.quit();
      }
    }]
  }, {
    label: "Edit",
    submenu: [{
      label: "Undo",
      accelerator: "Command+Z",
      selector: "undo:"
    }, {
      label: "Redo",
      accelerator: "Shift+Command+Z",
      selector: "redo:"
    }, {
      type: "separator"
    }, {
      label: "Cut",
      accelerator: "Command+X",
      selector: "cut:"
    }, {
      label: "Copy",
      accelerator: "Command+C",
      selector: "copy:"
    }, {
      label: "Paste",
      accelerator: "Command+V",
      selector: "paste:"
    }, {
      label: "Select All",
      accelerator: "Command+A",
      selector: "selectAll:"
    }, {
      label: "Open Debugger",
      accelerator: "Alt+Command+I",
      click: function() {
        mainWindow.openDevTools();
      }
    }, {
      label: "Refresh",
      accelerator: "Shift+Command+R",
      click: function() {
        mainWindow.loadUrl('file://' + __dirname + '/index.html');
      }
    }, ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

});
