Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0]
	      });
Crafty.c('trooper', { 
	     trooper :  function() {
		 this.requires("SpriteAnimation, Collision, Grid")
		     .animate("walk", 0, 4);
	     }
	 });
