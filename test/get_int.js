var http  = require('http-debug').http;
var https = require('http-debug').https;

var test = require('tape');

var MaxCDN = require('../index');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

if (process.env.DEBUG) {
    http.debug = 2;
    https.debug = 2;
}

test('get', function(t) {
    [ 'account.json',
        'account.json/address',
        'users.json',
        'zones.json' ]
    .forEach(function(endPoint) {

        // far from perfect but handles the above paths
        var key = (endPoint.indexOf('/') !== -1) ? endPoint.split('/')[1] : endPoint.split('.json')[0];

        maxcdn.get(endPoint, function(err, res) {
            t.error(err, 'get '+endPoint+' without error');
            t.ok(res.data[key], 'get '+endPoint+' with data');
        });
    });
    t.end();
});

// vim: ft=javascript ai sw=4 sts=4 et:

