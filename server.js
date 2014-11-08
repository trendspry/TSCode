#!/usr/bin/env node
var debug = require('debug')('rahulnode');
var app = require('./app');

app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);

var server = app.listen(app.get('port'), app.get('ip'), function() {
  debug('Express server listening on port ' + server.address().port);
  });
