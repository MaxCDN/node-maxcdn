#!/usr/bin/env node

var path = require('path');
var MaxCDN = require('../');

if (!process.env.ALIAS || !process.env.KEY || !process.env.SECRET) {
    usage();
}

/***
 * Pull and validate arguments for report type.
 */
var valid_reports = [ 'daily', 'hourly', 'monthly', '' ];
var report = '';
if (process.argv[2]) {
    var arg = process.argv[2].trim();
    if (valid_reports.indexOf(arg) !== -1) {
        if (arg !== '') {
            report = '';
        } else {
            report = '/'+arg;
        }
    }
}

var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

/***
 * Wrap maxcdn.get to abstract generic error handling.
 */
function get(url, callback) {
    maxcdn.get(url, function(error, result) {

        /***
         * Error handling.
         */
        if (error) {
            console.trace(error);
            process.exit(1);
        }

        /***
         * Callback on success.
         */
        callback(result.data);

    });
}

/***
 * First, get pullzone id's.
 */
get('zones/pull.json', function(zones) {

    /***
     * Iterate through pull zones.
     */
    zones.pullzones.forEach(function(zone) {
        console.log('Zone report for: %s (%s)', zone.name, zone.url);

        /***
         * Second, get summary.
         */
        get('reports/'+zone.id+'/stats.json'+report, function(report) {

            /***
             * Format summary.
             */
            Object.keys(report.summary).forEach(function(key) {
                console.log('- %s: %s', key, report.summary[key]);
            });

            /***
             * Third, get popularfiles... limit 10.
             */
            get('reports/'+zone.id+'/popularfiles.json?page_size=10', function(popular) {
                console.log('');
                console.log('Popular files:');

                /***
                 * Iterate over popular files and format data.
                 */
                popular.popularfiles.forEach(function(file) {
                    console.log('- url: %s', file.uri);
                    console.log('  - hits: %s', file.hit);
                    console.log('  - size: %s', file.size);
                });
            });
        });
        console.log('');
    });
});

/***
 * Usage
 */
function usage() {
    console.log('');
    console.log('Usage: report.js [hourly|daily|monthly]');
    console.log('');
    console.log('  Report types only cover summary.');
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
