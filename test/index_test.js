var test = require('tape');

// OAuth stub.
function oaStub() {
    var callback = arguments[arguments.length-1];
    callback(null, '{ "foo": "bar" }', '');
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
    });

    // put
    m.put('path', 'data', function(err, data) {
        t.equal(data.foo, 'bar');
    });

    // post
    //m.post('path', 'data', function(err, data) {
        //t.equal(data.foo, 'bar');
    //});

    // delete
    //m.delete('path', function(err, data) {
        //t.equal(data.foo, 'bar');
    //});
    //m.delete(['path1','path2'], function(err, data) {
        //t.equal(data['path1'].foo, 'bar');
        //t.equal(data['path2'].foo, 'bar');
    //});

    t.end();
});

// vim: ft=javascript ai sw=4 sts=4 et:
