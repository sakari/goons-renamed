Crafty.scene("main", function () {
		 //##src/world.js
		 generateWorld(5000, 5000);

		 //##src/trooper.js
		 //##src/barracks.js
		 var player = Crafty.e("2D, DOM, blue_trooper, player_trooper")
		     .attr({ x: 100, y: 100, z:2 })
		     .player_trooper();

		 var barracks = Crafty.e("Barracks")
		     .attr({ x : 400, y : 400})
		     .Barracks(10000);

		 var trooper1 = Crafty.e("2D, DOM, blue_trooper, ai_trooper")
		     .attr({ x: 110, y: 110, z:2 })
		     .ai_trooper();

		 var trooper2 = Crafty.e("2D, DOM, blue_trooper, ai_trooper")
		     .attr({ x: 320, y: 120, z:2 })
		     .ai_trooper();		 
	     });