var http  = require('http-debug').http;
var https = require('http-debug').https;

var test = require('tape');

var MaxCDN = require('../index');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

var time = Date.now().toString();

function bumpTime(n) {
    return time+'_'+n;
}

if (process.env.DEBUG) {
    http.debug = 2;
    https.debug = 2;
}

test('put', function(t) {
    var time1 = bumpTime(1);
    maxcdn.put('account.json', "name="+time1, function(err, res) {
        t.notOk(err, 'put (query string) without error');
        t.equal(res.data.account.name, time1, 'put (query string) updates field');
    });

    var time2 = bumpTime(2);
    maxcdn.put('account.json/address', '{ "street1": "'+time2+'" }', function(err, res) {
        t.notOk(err, 'put (json string) without error');
        t.equal(res.data.address.street1, time2, 'put (json string) updates field');
    });

    var time3 = bumpTime(3);
    maxcdn.put('account.json/address', { street2: time3 }, function(err, res) {
        t.notOk(err, 'put (js object) without error');
        t.equal(res.data.address.street2, time3, 'put (json string) updates field');
    });
    t.end();
});
// vim: ft=javascript ai sw=4 sts=4 et:
