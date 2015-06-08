clean:
	-rm -rf ./dist

build: clean
	./node_modules/.bin/babel src --out-dir dist --stage 0

doc:
	./node_modules/.bin/docco --layout parallel src/*.js README.md

mocha_test:
	NODE_ENV=test ./node_modules/.bin/mocha --require hook --reporter spec

test_cov:
	NODE_ENV=test ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --require hook

test_travis:
	NODE_ENV=test ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha --report lcovonly -- --require hook
