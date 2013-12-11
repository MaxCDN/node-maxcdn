#!/usr/bin/env node
var http = require('http');
var url  = require('url');

var MaxCDN = require('../');
var maxcdn = new MaxCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET);

function get(res, path, callback) {
    try {
        maxcdn.get(path, function(err, result) {
            res.writeHead(result.code || err.statusCode, {"Content-Type": "application/json"});
            result = result.data;

            if (err) {

                /**
                 * Write error to response.
                 */
                res.write(JSON.stringify(err,null,4));

            } else {

                /***
                 * This method of choosing output doesn't really scale
                 * to multiple output types, but works for this case.
                 */
                result = (!result.popularfiles) ? result.summary : result.popularfiles;

                /**
                 * write result to response.
                 */
                res.write(JSON.stringify(result,null,4));
            }

            res.end();
        });
    } catch (e) {

        /***
         * Catch any errors and report them to response.
         */
        res.writeHead(500);
        res.write(e.stack);
        res.end();

    }
}

var server = http.createServer(function(req, res) {
    /***
     * Rejecting non-get methods for safty sake.
     */
    if (req.method !== 'GET') {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.write(JSON.stringify({
            code: 500,
            error: "write methods not supported, it's a bad idea on open apis"
        }));
        res.end();
        return;
    }

    var uri = url.parse(req.url).pathname;

    /***
     * Simple switch based routing.
     */
    switch(uri) {
        case '/summary/hourly':
        case '/summary':
        case '/hourly':
        case '/':
            get(res, "/reports/stats.json/hourly");
            break;
        case '/summary/daily':
        case '/daily':
            get(res, "/reports/stats.json/daily");
            break;
        case '/summary/monthly':
        case '/monthly':
            get(res, "/reports/stats.json/monthly");
            break;
        case '/popular':
            get(res, "/reports/popularfiles.json");
            break;
        default:
            /***
             * This is only not (too) scary because we're rejecting
             * non-GET methods.
             */
            get(res, uri);
    }
})

/***
 * Server startup, with messaging.
 */
console.log('Starting server on port 8000.');
server.listen(8000);

// vim: ft=javascript ai sw=4 sts=4 et:
