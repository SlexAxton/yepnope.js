var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.get( '/s/js/*', function( req, res ) {
  var url = req.url;
  var date;
  var sleep;
  var basename;

  res.setHeader("Content-Type", "text/javascript");

  // No cache
  if ( ~ url.indexOf("no-cache")) {
    date = (new Date( (+new Date() - 2000000) )).toUTCString();
    res.setHeader("Last-Modified", date);
    res.setHeader("Expires", date);
    res.setHeader("Pragma", "no-cache");
  } else {
    res.setHeader("Expires", "Thu, 31 Dec 2030 20:00:00 GMT");
  }

  // Sleep to simulate a slow loading server
  sleep = /\/sleep-(\d+)\//.exec( url );
  if ( sleep ) {
    sleep = sleep.pop();
  } else {
    sleep = 0;
  }


  var wrapStart = "yepnope.wrap(function(){";
  var wrapEnd = "});";
  if ( ~ url.indexOf("no-wrap")) {
    wrapStart = "";
    wrapEnd = "";
  }

  setTimeout(function() {
    basename = url.split("/").pop().split(".").shift();
    res.end([wrapStart,
      "  yeptest." + basename + " = (+new Date);",
      wrapEnd
    ].join("\n"));

  }, sleep);

});

app.get( '/s/css/*', function( req, res ) {
  var url = req.url,
  date, sleep, basename;

  res.setHeader("Content-Type", "text/css");
  res.setHeader("Expires", "Thu, 31 Dec 2030 20:00:00 GMT");

  // Sleep to simulate a slow loading server
  sleep = /\/sleep-(\d+)\//.exec( url );
    if ( sleep ) {
    sleep = sleep.pop();
  } else {
    sleep = 0;
  }

  setTimeout(function() {
    var basename = url.split("/").pop().split(".").shift();
    res.end("#item_" + basename.split(",").join("") + " { color: rgb(" + basename + ");}");
  }, sleep);
});

exports = module.exports = server;

exports.use = function() {
  app.use.apply(app, arguments);
};
