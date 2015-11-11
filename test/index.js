var t = require('tap');

var spawnm = require('../index');
var path = require('path');

t.test('basic example', function(t) {
  spawnm(require, './harness/example', function(err, proc) {
    proc.shout('meep', function(err, shouted) {
      t.equals(shouted, 'MEEP');
      spawnm.kill(proc);
      t.end();
    });
  });
});

t.test('no require; absolute path', function(t) {
  spawnm(path.resolve(path.join(__dirname, './harness/example')),
    function(err, proc) {
      proc.shout('meep', function(err, shouted) {
        t.equals(shouted, 'MEEP');
        spawnm.kill(proc);
        t.end();
      });
    });
});

t.test('no require; relative path', function(t) {
  spawnm(path.join(__dirname, './harness/example'),
    function(err, proc) {
      proc.shout('meep', function(err, shouted) {
        t.equals(shouted, 'MEEP');
        spawnm.kill(proc);
        t.end();
      });
    });
});
