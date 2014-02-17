#!/usr/bin/env node
/*********************************************************
 * Example script for uploading ssl certs to maxcdn
 * pull zone.
 *
 *
 * Setup to run this script:
 *
 * $ npm install maxcdn http-debug
 *
 ********************************************************/

var path = require('path');
var https = require('http-debug').https;
var fs = require('fs');
var format = require('util').format;
var MaxCDN = require('maxcdn');

if (process.argv.length < 4) {
    console.log('Usage: %s ZONEID CERT KEY [CA BUNDLE]');
    process.exit(1);
}

var zid = process.argv[2];
var crt = fs.readFileSync(path.resolve(process.argv[3]), {encoding: 'utf8'}).trim();
var key = fs.readFileSync(path.resolve(process.argv[4]), {encoding: 'utf8'}).trim();

var ca;
if (process.argv[5]) {
    ca = fs.readFileSync(path.resolve(process.argv[5]), {encoding: 'utf8'}).trim();
}

max = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

var certs = {
    ssl_crt: crt,
    ssl_key: key
};

if (typeof ca !== 'undefined') {
    certs.ca = ca;
}

https.debug = parseInt(process.env.DEBUG, 10) || 0;
max.post(format('/zones/pull/%s/ssl.json', zid), certs, function (err, res) {
    if (err) console.trace(err);
    console.dir(res);
});

