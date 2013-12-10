#!/usr/bin/env node

var MaxCDN = require('../');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

maxcdn.get('account.json', function(err, results) {
    if (err) console.trace(err);
    console.log('account.json');
    console.dir(results);
    console.log('');
});

maxcdn.get('account.json/address', function(err, results) {
    if (err) console.trace(err);
    console.log('account.json/address');
    console.dir(results);
    console.log('');
});

maxcdn.get('reports/stats.json/hourly', function(err, results) {
    if (err) console.trace(err);
    console.log('reports/stats.json/hourly summary');
    console.dir(results.data.summary);
    console.log('');
});

// vim: ft=javascript ai sw=4 sts=4 et:
