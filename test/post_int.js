var http  = require('http-debug').http;
var https = require('http-debug').https;

var test = require('tape');

var MaxCDN = require('../index');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

var time = Date.now().toString();

if (process.env.DEBUG) {
    http.debug = 2;
    https.debug = 2;
}

test('post', function(t) {
    var zone = {
        name: time,
        url: 'http://www.example.com'
    };
    maxcdn.post('zones/pull.json', zone, function(err, res) {
        t.notOk(err, 'post (js object) without error');
        t.ok(res.data.pullzone.id, 'post with response');
        maxcdn.delete('zones/pull.json/'+res.data.pullzone.id, function(eerr, rres) {
            t.notOk(eerr, 'delete without error');
            t.equal(rres.code, 200, 'delete successful');
        });
    });
    t.end();
});

// vim: ft=javascript ai sw=4 sts=4 et:
