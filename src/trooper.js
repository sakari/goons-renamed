Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0]
	      });
Crafty.sprite(3, 3, "sprites/bullet.png", {
		 bullet : [0, 0] 
	      });

Crafty.c('Bullet', {
	     init : function() {
	     },
	     Bullet : function(direction_rad, speed) {
		 var d = Trig.to_movement(direction_rad, speed);
		 return this.bind('EnterFrame', function() {
		 	       this.attr('x', this.x + d.x);
		 	       this.attr('y', this.y + d.y);
			       return;
		 	   });
	     }
	 });

Crafty.c('TrooperControl', {
	     init : function() {
		 this.requires('Keyboard, Multiway');
	     }
	     , TrooperControl : function() {
		 var current_direction_rad = 0;
		 var shoot_delay_ms = 500;
		 var last_shot_ms = 0;
		 
		 return this
		     .multiway(1, { UP_ARROW : -90, DOWN_ARROW : 90, RIGHT_ARROW : 0, LEFT_ARROW : 180} )
		     .bind("NewDirection", function(movement) {
			       if (movement.x || movement.y) {
				   current_direction_rad = Math.atan2(movement.y, movement.x);
			       }
			   })
		     .bind('KeyDown', function(e) {
			       if (e.key != Crafty.keys.A) {
				   return;
			       }
			       var current_time = new Date().getTime();
			       var deviation_rad = 0.2;

			       if (last_shot_ms + shoot_delay_ms < current_time) {
				   last_shot_ms = current_time;
			     	   Crafty.e('2D, DOM, bullet, Bullet')
				       .attr({ x: this.x + 3 , y: this.y + 5, z: 3 })
				       .Bullet(Trig.fuzzy_angle(current_direction_rad, deviation_rad), 5);
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
