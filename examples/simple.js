#!/usr/bin/env node

var MaxCDN = require('../');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

/***
 * Get account information.
 */
maxcdn.get('account.json', function(err, results) {
    console.log('GET account.json')
    if (err) {
        // error handling
        console.trace(err);
    } else {
        // print results
        console.dir(results);
    }
});

/***
 * Get account address information.
 */
maxcdn.get('account.json/address', function(err, results) {
    console.log('account.json/address');
    if (err) {
        // error handling
        console.trace(err);
    } else {
        // print results
        console.dir(results);
    }
});

maxcdn.get('reports/stats.json/hourly', function(err, results) {
    console.log('reports/stats.json/hourly summary');
    if (err) {
        // error handling
        console.trace(err);
    } else {
        // print results
        console.dir(results.data.summary);
    }
});

// vim: ft=javascript ai sw=4 sts=4 et:
