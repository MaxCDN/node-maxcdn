var OAuth       = require('oauth').OAuth;
var path        = require('path');
var querystring = require('querystring');
var async       = require('async');

function MaxCDN(alias, key, secret) {
    if (typeof alias !== 'string') {
        throw new Error('company alias missing or not a string');
    }
    if (typeof key !== 'string') {
        throw new Error('consumer key missing or not a string');
    }
    if (typeof secret !== 'string') {
        throw new Error('consumer secret missing or not a string');
    }

    this.API_SERVER = 'https://rws.netdna.com';
    this.alias      = alias;
    this.key        = key;
    this.secret     = secret;

    this.oauth = new OAuth(
        this.API_SERVER + path.join('/', 'oauth', 'request_token'),
        this.API_SERVER + path.join('/', 'oauth', 'access_toekn'),
        key, secret, '1.0', null, 'HMAC-SHA1'
    );

    return this;
}

MaxCDN.prototype._makeQuerystring = function _makeQuerystring(params) {
    if (typeof params !== 'string') {
        return querystring.stringify(params);
    }
    try {
        return querystring.stringify(JSON.parse(params));
    } catch(e) {}
    return params;
};

MaxCDN.prototype._makeObject = function _makeObject(params) {
    if (typeof params === 'string') {
        try {
            return JSON.parse(params);
        } catch (e) {
            try {
                return querystring.parse(params);
            } catch (ee) {
                throw new Error('invalid params string');
            }
        }
    }
    return params;
};

MaxCDN.prototype._makeUrl = function _makeURL(p) {
    return this.API_SERVER + path.join('/', this.alias, p);
};

MaxCDN.prototype.get = function get(url, callback) {
    this.oauth.get(this._makeUrl(url), '', '', this._parse(callback));
};

MaxCDN.prototype.put = function put(url, data, callback) {
    this.oauth.put(this._makeUrl(url), '', '', this._makeQuerystring(data), this._parse(callback));
};

MaxCDN.prototype.post = function post(url, data, callback) {
    this.oauth.post(this._makeUrl(url), '', '', this._makeObject(data), this._parse(callback));
};

MaxCDN.prototype.delete = function del(url, files, limit, callback) {
    var default_limit = 25;
    if (typeof limit === 'function') {
        callback = limit;
        limit = default_limit;
    }
    if (typeof files === 'function') {
        callback = files;
        limit = default_limit;
        files = null;
    }

    var that = this;
    function dd(u) {
        return function(cb) {
            that.oauth.delete(that._makeUrl(u), '', '', that._parse(
                function(err, data) { cb(err, data); }
            ));
        };
    }
    var runs = [];
    if (files !== null) {
        if (!files.files) {
            throw new Error('invalid files object');
        }
        files.files.forEach(function(file) {
            runs.push(dd(url + '?' + that._makeQuerystring({files: file})));
        });
    }
    if (runs == 0) {
        that.oauth.delete(that._makeUrl(url), '', '', that._parse(callback));
    } else {
        async.parallelLimit(runs, limit, function(err, res) {
            callback(err, res);
        });
    }
};

MaxCDN.prototype._parse = function _parse(callback) {
    return function(err, data, response) {
        try {
            data = JSON.parse(data);
        } catch(e) {
            err = {
                statusCode: 500,
                data: 'Invalid JSON from MaxCDN\'s API.'
            };
        }
        callback(err, data);
    };
};

module.exports = MaxCDN;
// vim: ft=javascript ai sw=4 sts=4 et:
