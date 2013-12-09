setup: clean
	npm cache clean
	npm install

clean:
	rm -rf node_modules

test:
	./node_modules/.bin/tape ./test/*_test.js

int:
	./node_modules/.bin/tape ./test/*_int.js

integration: int

.PHONY: test
