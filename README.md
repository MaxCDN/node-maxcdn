# node-maxcdn

MaxCDN API for Node.js

## Install

```
$ npm install github jmervine/node-maxcdn
```

## Usage

#### Initialize

```
var MaxCDN = require('maxcdn');
var maxcdn = new MaxCDN({
    alias:  'COMPANY_ALIAS',
    key:    'CONSUMER_KEY',
    secret: 'CONSUMER_SECRET'
});
```

#### `maxcdn.get`

```
maxcdn.get('reports/stats.json/daily', function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    console.dir(resultS);
});
```

#### `maxcdn.put`

```
var updates = {
    street1: '555 Some St.',
    street2: 'Suite #1'
};
maxcdn.put('account.json/address', updates, function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    console.dir(resultS);
});
```

#### `maxcdn.delete`

```
var zoneId = '121212';

// full cache
maxcdn.delete('zones/pull.json/'+zoneId+'/cache', function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    if (results.code === 200) {
        console.log('SUCCESS!');
    }
});

// specific files
var files = { files: [ '/master.css', '/another.css' ] };
maxcdn.delete('zones/pull.json/'+zoneId+'/cache', files, function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    if (results[0].code === 200) {
        console.log('SUCCESS: %s', files.files[0]);
    }
    if (results[1].code === 200) {
        console.log('SUCCESS: %s', files.files[1]);
    }
});
```

#### Not Implemented

* post - fails with error, getting the same error with Ruby gem.


## Running Tests

#### Unit Tests

```
$ make setup test
```

#### Integration Tests

```
$ ALIAS=alias KEY=key SECRET=secret make setup int
```

> **Troubleshooting:**
>
> Ensure that you `ALIAS`, `KEY` and `SECRET` values are correct and that you're running integration on a host with a whitelisted IP address.

