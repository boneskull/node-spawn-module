'use strict';

var cp = require('child_process');
var streamify = require('./streamify');
var dnode = require('dnode');
var duplexer = require('duplexer');
var through = require('through');
var path = require('path');
var Promise = require('bluebird');

module.exports = function(req, modulePath, cb) {
  var child = cp.fork(require.resolve('./worker'));

  if (typeof(req) === 'string') {
    cb = modulePath;
    modulePath = req;
    if (!path.isAbsolute(modulePath)) {
      modulePath = path.resolve(path.dirname(module.parent.filename), req);
    }
  } else if (req.resolve) {
    modulePath = req.resolve(modulePath);
  }

  child.send({
    cmd: 'load',
    path: modulePath
  });

  var d = dnode();
  var s = streamify(child);

  s.pipe(d).pipe(s);

  return new Promise(function(resolve) {
    d.on('remote', function(remote) {
      remote.__child_process__ = child;
      resolve(remote);
    });
  })
    .asCallback(cb);
};

module.exports.kill = function(remote) {
  remote.__child_process__.kill();
  remote.__child_process__ = null;
};
