var test = require('tape');

// OAuth stub.
function oaStub() {
    var callback = arguments[arguments.length-1];

    var res = JSON.stringify({
        foo: "bar",
        arguments: arguments
    });

    callback(null, res, '');
}

var OAuth = require('oauth').OAuth;
OAuth.prototype.get    = oaStub;
OAuth.prototype.put    = oaStub;
OAuth.prototype.post   = oaStub;
OAuth.prototype.delete = oaStub;

var MaxCDN = require('../index');

test('maxcdn', function(t) {
    // setup
    t.throws(function() {
        new MaxCDN();
    });

    t.doesNotThrow(function() {
        new MaxCDN('alias', 'key', 'secret');
    });

    var m = new MaxCDN('alias', 'key', 'secret');
    t.equal(m.alias  , 'alias');
    t.equal(m.key    , 'key');
    t.equal(m.secret , 'secret');

    // _makeUrl
    t.equal(m._makeUrl('foobar'), 'https://rws.netdna.com/alias/foobar');

    // _makeQuerystring
    t.equal(m._makeQuerystring({ foo: 'bar' }), 'foo=bar');
    t.equal(m._makeQuerystring('{ "foo": "bar" }'), 'foo=bar');
    t.equal(m._makeQuerystring('foo=bar'), 'foo=bar');

    // _makeObject
    t.equal(m._makeObject({ foo: 'bar' }).foo, 'bar');
    t.equal(m._makeObject('{ "foo": "bar" }').foo, 'bar');
    t.equal(m._makeObject('foo=bar').foo, 'bar');

    // _parse
    m._parse(function(err, data) {
        t.ok(err, 'should have err');
        t.ok(data, 'should have data');
    })(null, 'foobar', '');

    m._parse(function(err, data) {
        t.ok(err, 'should have err');
        t.ok(data, 'should have data');
    })(new Error(), '{ "foo": "bar" }', '');

    m._parse(function(err, data) {
        t.notOk(err, 'should not have err');
        t.ok(data, 'should have data');
    })(null, '{ "foo": "bar" }', '');

    // get
    m.get('path', function(err, data) {
        t.equal(data.foo, 'bar');
        t.equal(data.arguments[0], 'https://rws.netdna.com/alias/path');
    });

    // put
    m.put('path', { data: 'data' }, function(err, data) {
        t.equal(data.foo, 'bar');
        t.equal(data.arguments[0], 'https://rws.netdna.com/alias/path');
        t.deepEqual(data.arguments[3], { data: 'data' });
    });

    // post
    m.post('path', { data: 'data' }, function(err, data) {
        t.equal(data.foo, 'bar');
        t.equal(data.arguments[0], 'https://rws.netdna.com/alias/path');
        t.deepEqual(data.arguments[3], { data: 'data' });
    });

    // delete
    m.delete('path', function(err, data) {
        t.equal(data.foo, 'bar');
        t.equal(data.arguments[0], 'https://rws.netdna.com/alias/path');
        t.notOk(data.arguments[3]);
    });

    m.delete('path', { files: ['path1','path2'] }, function(err, data) {
        t.equal(data.foo, 'bar');
        t.equal(data.arguments[0], 'https://rws.netdna.com/alias/path');
        t.deepEqual(data.arguments[3], { files: [ 'path1', 'path2' ] });
    });

    t.end();
});

// vim: ft=javascript ai sw=4 sts=4 et:
