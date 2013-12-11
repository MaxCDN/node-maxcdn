#!/usr/bin/env node

var path = require('path');
var MaxCDN = require('../');

if (!process.env.ALIAS || !process.env.KEY || !process.env.SECRET || process.argv.length === 2 ) {
    usage();
}

var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

/***
 * Pull Zone ID from CLI arguments.
 */
var zoneId = process.argv[2];

/***
 * Optionally, pull files from CLI arguments.
 */
var files  = process.argv.slice(3, process.argv.length);

/***
 * URL to MaxCDN API.
 */
var url     = path.join('zones', 'pull.json', zoneId, 'cache');

/***
 * Define callback for OAuth requests to MaxCDN.
 */
function callback(error, results) {
    /***
     * Error handling.
     */
    if (error) {
        console.trace(error);
        return;
    }

    /***
     * Report success.
     */
    console.log('Cache successfully cleared!');
}

if (files == 0) {
    /***
     * If no files are passed, purge full cache.
     */
    maxcdn.delete(url, callback);
} else {
    /***
     * Otherwise, only purge files specified.
     */
    files = { files: files };
    maxcdn.delete(url, files, callback);
}

/***
 * Usage
 */
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
