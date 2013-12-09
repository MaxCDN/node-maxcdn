var OAuth       = require('oauth').OAuth;
var path        = require('path');
var querystring = require('querystring');

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
    throw new Error('post is not implemented at this time due to destination API issues');
    //this.oauth.post(this._makeUrl(url), '', '', this._makeQuerystring(data), this._parse(callback));
};

MaxCDN.prototype.delete = function del(url, callback) {
    throw new Error('post is not implemented at this time due to destination API issues');
    //var that = this;
    //function del(u, cb) {
        //that.oauth.delete(that._makeUrl(u), '', '', that._parse(cb));
    //}

    //if (typeof url === 'string') {
        //del(url, callback);
    //} else {
        //var results = {};
        //var errors  = {};
        //var count   = 0;
        //url.forEach(function(u) {
            //del(u, function(err, data) {
                //if (err) {
                    //errors[u] = err;
                //} else {
                    //results[u] = data;
                //}

                //// am I done?
                //if (++count === url.length) {
                    //callback(errors, results);
                //}
            //});
        //});
    //}
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
