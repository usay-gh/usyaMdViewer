var app = require('app');  // Module to control application life.
var fs = require('fs');
var dialog = require('dialog');
var markdown = require('js-markdown-extra');


var BrowserWindow = require('browser-window');  // Module to create native browser window.
var width = 800;
var height = 800;

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width, 
    height: height,
    transparent: false,
    frame: true,    
    });

  //=================================================================
 
 // getting markdown file name from ARGV
  var mdFilePath = undefined;
  if(process.argv[1] == '.' ) {
    // electron debugging
     mdFilePath = process.argv[2];
  } else {
    // built module
    mdFilePath = process.argv[1];
  }

  if(mdFilePath === undefined) {
    // error
    dialog.showErrorBox("Error", "please specify a markdown file.");
  }
  
  // reading markdonw file
  var mdText = fs.readFileSync(mdFilePath, "utf-8");

  var mdHtml = markdown.Markdown(mdText);

  // reading html template file
  var templateText = fs.readFileSync('./index.html.template', "utf-8");
  // replace keywords 
  templateText = templateText.replace(/__TITLE__/g, mdFilePath);
  templateText = templateText.replace(/__BODY__/g, mdHtml);
  // writee temporary file
  fs.writeFileSync('./tmp.html', templateText);

  
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/tmp.html');
  console.log('file://' + __dirname + '/tmp.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    
    //delete tmp files
    fs.unlink('./tmp.html', function (err) {
      if (err) {
        console.log('delete faild.');

      }
    });
    
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    

  });
});

