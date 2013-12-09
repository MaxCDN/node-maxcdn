#!/usr/bin/env node

var path = require('path');
var MaxCDN = require('../');

if (!process.env.ALIAS || !process.env.KEY || !process.env.SECRET) {
    usage();
}

var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);
var url = path.join('reports', 'stats.json', 'daily');

function callback(error, results) {
    if (error) {
        console.trace(error);
        return;
    }
    console.dir(results);
}

maxcdn.delete(url, callback);

function usage() {
    console.log('');
    console.log('Usage: report.js ZONEID');
    console.log('');
    console.log('  Credentials:');
    console.log('');
    console.log('  Add your credentials to your environment, like so:');
    console.log('');
    console.log('  $ export ALIAS=comapny_alias');
    console.log('  $ export KEY=consumer_key');
    console.log('  $ export SECRET=consumer_secret');
    console.log('  $ ./report.js 121212 /master.css /another.css');
    console.log('');
    console.log('  Or by passing them to the script.');
    console.log('');
    console.log('  $ ALIAS=comapny_alias KEY=consumer_key SECRET=consumer_secret ./report.js');
    console.log('');
    process.exit();
}

// vim: ft=javascript ai sw=4 sts=4 et:
