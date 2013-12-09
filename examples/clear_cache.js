#!/usr/bin/env node

var path = require('path');
var MaxCDN = require('../');

if (!process.env.ALIAS || !process.env.KEY || !process.env.SECRET || process.argv.length === 2 ) {
    usage();
}

var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

var zoneId = process.argv[2];
var files  = process.argv.slice(3, process.argv.length);
var url     = path.join('zones', 'pull.json', zoneId, 'cache');

function callback(error, results) {
    if (error) {
        console.trace(error);
        return;
    }
    console.log('Cache successfully cleared!');
}

if (files == 0) {
    maxcdn.delete(url, callback);
} else {
    files = { files: files };
    maxcdn.delete(url, files, callback);
}

function usage() {
    console.log('');
    console.log('Usage: clear_cache.js ZONEID [FILES]');
    console.log('');
    console.log('  Credentials:');
    console.log('');
    console.log('  Add your credentials to your environment, like so:');
    console.log('');
    console.log('  $ export ALIAS=comapny_alias');
    console.log('  $ export KEY=consumer_key');
    console.log('  $ export SECRET=consumer_secret');
    console.log('  $ ./clear_cache.js 121212 /master.css /another.css');
    console.log('');
    console.log('  Or by passing them to the script.');
    console.log('');
    console.log('  $ ALIAS=comapny_alias KEY=consumer_key SECRET=consumer_secret ./clear_cache.js \'');
    console.log('       121212 /master.css /another.css');
    console.log('');
    process.exit();
}

// vim: ft=javascript ai sw=4 sts=4 et:
