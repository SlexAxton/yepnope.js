var express = require('express');
var app = express();
var server = require('http').createServer(app);

var qs = require('qs');

app.get( '/s/js/*', function( req, res ) {
  var url = req.url;
  var date;
  var sleep;
  var basename;

  res.setHeader('Content-Type', 'text/javascript');

  // No cache
  if ( ~ url.indexOf('no-cache')) {
    date = (new Date( (+new Date() - 2000000) )).toUTCString();
    res.setHeader('Last-Modified', date);
    res.setHeader('Expires', date);
    res.setHeader('Pragma', 'no-cache');
  } else {
    res.setHeader('Expires', 'Thu, 31 Dec 2030 20:00:00 GMT');
  }

  // Sleep to simulate a slow loading server
  sleep = /\/sleep-(\d+)\//.exec( url );
  if ( sleep ) {
    sleep = sleep.pop();
  } else {
    sleep = 0;
  }


  setTimeout(function() {
    basename = url.split('/').pop().split('.').shift();
    var querystring;
    var query = {};

    if (url.indexOf('?') >= 0) {
      querystring = url.replace(/^.*\?/, '');
      query = qs.parse(querystring);
    }

    var tests;

    if (query.yep || query.nope) {
      tests = {};
      if (query.yep) {
        tests.yep = query.yep.split(',').map(function(x){
          return decodeURIComponent(x);
        });
      }
      if (query.nope) {
        tests.nope = query.nope.split(',').map(function(x){
          return decodeURIComponent(x);
        });
      }
    }

    var output = {
      timestamp: (+new Date)
    };

    if (tests) {
      output['tests'] = tests;
    }

    res.end('yeptest["' + basename + '"] = ' + JSON.stringify(output) + ';');
  }, sleep);

});

app.get( '/s/css/*', function( req, res ) {
  var url = req.url,
  date, sleep, basename;

  res.setHeader('Content-Type', 'text/css');
  res.setHeader('Expires', 'Thu, 31 Dec 2030 20:00:00 GMT');

  // Sleep to simulate a slow loading server
  sleep = /\/sleep-(\d+)\//.exec( url );
    if ( sleep ) {
    sleep = sleep.pop();
  } else {
    sleep = 0;
  }

  setTimeout(function() {
    var basename = url.split('/').pop().split('.').shift();
    res.end('#item_' + basename.split(',').join('') + ' { color: rgb(' + basename + ');}');
  }, sleep);
});

exports = module.exports = server;

exports.use = function() {
  app.use.apply(app, arguments);
};
