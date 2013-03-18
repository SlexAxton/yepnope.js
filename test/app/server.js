var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.get('/hello', function(req, res){
  res.send('bonjour!');
});

exports = module.exports = server;

exports.use = function() {
  app.use.apply(app, arguments);
};
