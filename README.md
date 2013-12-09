# node-maxcdn

Work in progress.

### Install this Alpha version

```
$ npm install github jmervine/node-maxcdn
```

### Working:

* get
* put
* delete

### Not working:

* post - fails with error, getting the same error with Ruby gem.

### TODO:

* documentation!
* post
    * functionality
    * tests
* cli, maybe?

### Running Tests

Unit:
```
$ make setup test
```

Integration:
```
$ ALIAS=alias KEY=key SECRET=secret make setup int

# Troubleshooting:
#
# Ensure that you ALIAS, KEY and SECRET values are correct
# and that you're running integration on a host with a
# whitelisted IP address.
```
