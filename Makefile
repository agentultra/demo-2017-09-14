all:
	@mkdir -p dist
	yarn run build
	@cp src/index.html dist/
