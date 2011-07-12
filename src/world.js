function generateWorld(width, height) {
    Crafty.sprite(16, "sprites/ground.png", {
		      ground0 : [0, 0],
		      ground1 : [1, 0],
		      ground2 : [2, 0],
		      ground3 : [3, 0],
		      ground4 : [4, 0],
		      ground5 : [5, 0],
		      ground6 : [6, 0],
		      ground7 : [7, 0],
		      ground8 : [8, 0],
		      ground9 : [9, 0]
		  });
    for (var i = 0; i * 16 < width; i++) {
	for (var j = 0; j * 16 < height; j++) {
	    var groundType = Crafty.randRange(0, 9);
	    Crafty.e("2D, DOM, ground" + groundType)
		.attr({ x: i * 16, y: j * 16, z:1 });
	}
    }
}