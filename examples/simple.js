#!/usr/bin/env node

var MaxCDN = require('../');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

/***
 * Get account information.
 */
maxcdn.get('account.json', function(err, results) {
    if (err) {
        // error handling
        console.trace(err);
    } else {
        // print results
        console.log('account.json\n%s\n',results);
    }
});

/***
 * Get account address information.
 */
maxcdn.get('account.json/address', function(err, results) {
    if (err) {
        // error handling
        console.trace(err);
    } else {
        // print results
        console.log('account.json/address\n%s\n',results);
    }
});

maxcdn.get('reports/stats.json/hourly', function(err, results) {
    if (err) {
        // error handling
        console.trace(err);
    } else {
        // print results
        console.log('reports/stats.json/hourly summary\n%s\n',
                        results.data.summart);
    }
});

// vim: ft=javascript ai sw=4 sts=4 et:
