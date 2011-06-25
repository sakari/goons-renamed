Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0]
	      });
Crafty.sprite(3, 3, "sprites/bullet.png", {
		 bullet : [0, 0] 
	      });

Crafty.c('Bullet', {
	     init : function() {
		 this.requires("SpriteAnimation", "Tween");
	     },
	     Bullet : function(direction_rad, speed) {
		 var dx = Math.round(Math.cos(direction_rad) *1000 * speed)/1000;
		 var dy = Math.round(Math.sin(direction_rad) *1000 * speed)/1000;
		 console.log("Bullet dx: " + dx + " dy: " + dy);
		 return this.bind('EnterFrame', function() {
				      this.attr('x', this.x + dx);
				      this.attr('y', this.y + dy);
				  });
	     }
	 });

Crafty.c('TrooperControl', {
	     init : function() {
		 this.requires('Keyboard, Fourway');
	     }
	     , TrooperControl : function() {
		 var current_direction_rad = 0;
		 var shoot_delay_ms = 500;
		 var last_shot_ms = 0;
		 
		 return this
		     .fourway(1)
		     .bind("NewDirection", function(movement) {
			       if (movement.x || movement.y) {
				   if (movement.x == 0 && movement.y > 0) {
				       current_direction_rad = 0;
				   } else if (movement.x == 0 && movement.y < 0) {
				       current_direction_rad = Math.PI;
				   } else {
				       current_direction_rad = Math.atan(movement.y / movement.x);				   
				   }
			       }
			   })
		     .bind('KeyDown', function(e) {
			       if (e.key != Crafty.keys.SPACE) {
				   return;
			       }
			       var current_time = new Date().getTime();

			       if (last_shot_ms + shoot_delay_ms < current_time) {
				   last_shot_ms = current_time;
			     	   Crafty.e('2D, DOM, Bullet, bullet')
				       .attr({ x: this.x, y: this.y, z: 3 })
				       .Bullet(current_direction, 10, 50);
			       }
			   });
	     }
});

Crafty.c('trooper', { 
	     init : function() {
		 this.requires("SpriteAnimation, TrooperControl");
	     },
	     trooper :  function() {
		 this.animate("walk", 0, 0, 3)
		     .TrooperControl()
		     .bind("NewDirection", function(direction) {
			       if (!direction.x && !direction.y)
				   this.stop();
			       else
				   this.stop().animate("walk", 20, -1);
			   });
		 return this;
	     }
	 });
