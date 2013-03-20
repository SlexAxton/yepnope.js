var Canvas = require('term-canvas')
var size = process.stdout.getWindowSize();
var Cloud = require('mocha-cloud');
var GridView = require('mocha-cloud-grid-view');

var testedbrowsers = require('./testedbrowsers.json');

var cloud = new Cloud('yepnope.js', 'yepnope', '1ccf3b66-7ba4-4f87-93a9-d067b3a2ec0a');

// the browsers to test
testedbrowsers.forEach(function (browser) {
  cloud.browser(browser.browser, browser.version, browser.os);
});

// the local url to test

cloud.url('http://127.0.0.1:3333/test/');

// setup

// clear the terminal
console.log("\033[2J\033[0f");

var canvas = new Canvas(size[0], size[1]);
var ctx = canvas.getContext('2d');
var grid = new GridView(cloud, ctx);
grid.size(canvas.width, canvas.height);
ctx.hideCursor();

// trap SIGINT

process.on('SIGINT', function(){
  ctx.reset();
  process.nextTick(function(){
    process.exit();
  });
});

// output failure messages
// once complete, and exit > 0
// accordingly

cloud.start(function(){
  grid.showFailures();
  setTimeout(function(){
    ctx.showCursor();
    process.exit(grid.totalFailures());
  }, 100);
});
