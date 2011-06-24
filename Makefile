all : 
	-rm -r build
	mkdir build
	./build.rb src/game.js >> build/fodder.js