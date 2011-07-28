Crafty.scene("loading", function () {
		 Crafty.load(["sprites/ground.png",
			      "images/grass.png",
			      "sprites/player_identifier.png",
			      "sprites/blue_trooper.png",
			      "sprites/barracks.png",
			      "sprites/bullet.png"], function () {
				 Crafty.scene("main"); //when everything is loaded, run the main scene
			     });
		 Crafty.background("#000");
		 Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
                     .text("Loading")
                     .css({ "text-align": "center" });
	     });