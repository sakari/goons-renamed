Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0]
	      });
Crafty.c('trooper', { 
	     init : function() {
		 this.requires("SpriteAnimation, Fourway");
	     },
	     trooper :  function() {
		 this.animate("walk", 0, 0, 3)
		     .fourway(1)
		     .bind("NewDirection", function(direction) {
			       if (!direction.x && !direction.y)
				   this.stop();
			       else
				   this.stop().animate("walk", 20, -1);
			   });
		 return this;
	     }
	 });
