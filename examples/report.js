#!/usr/bin/env node

var path = require('path');
var MaxCDN = require('../');

if (!process.env.ALIAS || !process.env.KEY || !process.env.SECRET) {
    usage();
}

var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

maxcdn.get('zones/pull.json', function(e, r) {
    if (e) {
        console.trace(e);
        return;
    }
    r.data.pullzones.forEach(function(zone) {
        console.log('Zone %s Summary', zone.id);
        var url = path.join('reports', zone.id, 'stats.json', 'daily');
        maxcdn.get(url, function(ee, rr) {
            if (ee) {
                console.trace(ee);
                return;
            }
            var summary = rr.data.summary;
            Object.keys(summary).forEach(function(key) {
                console.log('- %s: %s', key, summary[key]);
            });
        });
    });
});

function usage() {
    console.log('');
    console.log('Usage: report.js');
    console.log('');
    console.log('  Credentials:');
    console.log('');
    console.log('  Add your credentials to your environment, like so:');
    console.log('');
    console.log('  $ export ALIAS=comapny_alias');
    console.log('  $ export KEY=consumer_key');
    console.log('  $ export SECRET=consumer_secret');
    console.log('  $ ./report.js');
    console.log('');
    console.log('  Or by passing them to the script.');
    console.log('');
    console.log('  $ ALIAS=comapny_alias KEY=consumer_key SECRET=consumer_secret ./report.js');
    console.log('');
    process.exit();
}

// vim: ft=javascript ai sw=4 sts=4 et:
