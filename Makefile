clean:
	-rm -rf ./dist

build: clean
	./node_modules/.bin/babel src --out-dir dist --stage 0

doc:
	./node_modules/.bin/docco --layout parallel src/*.js README.md
