var OAuth       = require('oauth').OAuth;
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

    this.API_SERVER = 'https://rws.maxcdn.com';
    this.alias      = alias;
    this.key        = key;
    this.secret     = secret;

    headers = {
        "Accept" : "*/*",                         // << from OAuth default headers.
        "Connection" : "close",                   // << from OAuth default headers.
        "User-Agent" : "Node MaxCDN API Client"}; // << custom User-Agent

    this.oauth = new OAuth(
        this.API_SERVER + '/oauth/request_token',
        this.API_SERVER + '/oauth/access_token',
        key, secret, '1.0', null, 'HMAC-SHA1', null, headers);

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
    return this.API_SERVER + '/' + this.alias + '/' + p;
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

function del(url, files, callback) {
    if (typeof files === 'function') {
        callback = files;
        files = null;
    }

    /***
     * This is a workaround for OAuth not supporting sending
     * data (like a post) through the delete method, and not
     * querystring.stringify not supporting using index based
     * naming of params.
     *
     * Delete wants "files[0]=foo.css&files[1]=bar.css"
     ***/
    function stringify(arr) {
        var f = '';
        for (var i = 0; i < arr.length; i++) {
            f += 'files[' + i + ']=' + querystring.escape(arr[i])
            if (i !== arr.length-1) f += '&';
        }
        return f;
    }

    if (typeof files === 'string') {
        files = "files="+files;
    } else if (Array.isArray(files)) {
        files = stringify(files);
    } else if (files && files.files) {
        files = stringify(files.files);
    }
    if (files) url += '?' + files;

    this.oauth.delete(this._makeUrl(url), '', '', this._parse(callback));
};

MaxCDN.prototype.delete = del;
MaxCDN.prototype.del = del;


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
