var MaxCDN = require('../index');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);
var async  = require('async');
var format = require('util').format;

var post_name = Date.now().toString() + 'timer';
var timers = [];
var zoneid;

// fetch zoneid for timers
maxcdn.get('/zones/pull.json', function (err, res) {
    zoneid = res.data.pullzones[0].id;

    // timers
    timer('GET /reports/popularfiles.json', function (callback) {
        maxcdn.get('/reports/popularfiles.json', function (err, res) {
            callback(err);
        });
    });

    timer('PUT /reports/account.json/address', function (callback) {
        maxcdn.put('account.json/address', "street2="+post_name, function(err, res) {
            callback(err);
        });
    });

    timer('POST /zones/pull.json', function (callback) {
        var zone = {
            name: post_name,
            url: 'http://www.example.com'
        };

        maxcdn.post('/zones/pull.json', zone, function (err, res) {
            callback(err);
        });
    });

    timer('DELETE /zones/pull.json/PULL_ZONE', function (callback) {
        maxcdn.delete('/zones/pull.json/'+post_name, function (err, res) {
            callback(err);
        });
    });

    timer('DELETE /zones/pull.json/'+zoneid+'/cache', function (callback) {
        maxcdn.delete('/zones/pull.json/'+zoneid+'/cache', function (err, res) {
            callback(err);
        });
    });

    timer('DELETE /zones/pull.json/'+zoneid+'/cache w/ [ files ]', function (callback) {
        maxcdn.delete('/zones/pull.json/'+zoneid+'/cache',
                        [ '/master.css', '/favicon.ico' ],
                        function (err, res) {
            callback(err);
        });
    });

    // run timers
    async.series(timers);
});

// timer function
function timer(label, test) {
    timers.push(function (callback) {
        var start = new Date();
        process.stdout.write(label+': ');
        test( function (err) {
            if (err) {
                console.log('FAILED');
                console.trace(err);
                return;
            }
            console.log('%s ms', new Date() - start);
            callback();
        });
    });
}

