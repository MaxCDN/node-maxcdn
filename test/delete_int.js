var http  = require('http-debug').http;
var https = require('http-debug').https;

var test = require('tape');

var MaxCDN = require('../index');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

if (process.env.DEBUG) {
    http.debug = 2;
    https.debug = 2;
}

test('delete', function(t) {
    maxcdn.get('zones/pull.json', function(err, res) {
        var id = res.data.pullzones[0].id;
        maxcdn.delete('zones/pull.json/'+id+'/cache', function(err, res) {
            t.error(err, 'delete w/o error');
            t.equal(res.code, 200, 'delete successful');
        });

        // delete multiple
        maxcdn.get('reports/popularfiles.json', function(err, res) {
            var file1 = res.data.popularfiles.shift().uri;
            var file2 = res.data.popularfiles.shift().uri;
            maxcdn.delete('zones/pull.json/'+id+'/cache', [file1, file2],
                function(err, res) {
                    t.error(err, 'delete via Array w/o error');
                    t.equal(res.code, 200, 'delete via Array successful');
            });
            maxcdn.delete('zones/pull.json/'+id+'/cache', { "files": [file1, file2] },
                function(err, res) {
                    t.error(err, 'delete via Object w/o error');
                    t.equal(res.code, 200, 'delete via Object successful');
            });
        });
    });

    t.end();
});

// vim: ft=javascript ai sw=4 sts=4 et:
