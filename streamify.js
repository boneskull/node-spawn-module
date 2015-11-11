var through = require('through');
var duplexer = require('duplexer');

module.exports = function streamify(proc) {
  var sread = through();

  proc.on('message', function(data) {
    if (data.cmd == 'stream') {
      sread.push(data.data);
    }
  });

  proc.on('disconnect', function() {
    sread.push(null);
  });

  return duplexer(through(function(data) {
    proc.send({
      cmd: 'stream',
      data: data
    });
  }), sread);
};