function generateWorld(width, height) {
    Crafty.settings.register("goons.world.dimensions", 
			     function() {});
    Crafty.settings.modify("goons.world.dimensions", 
			   { width : width , 
			     height : height });
    Crafty.e("2D, DOM, Image")
	.attr({ w: width, h: height})
	.image("images/grass.png", "repeat");
};