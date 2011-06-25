Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0]
	      });
Crafty.sprite(3, 3, "sprites/bullet.png", {
		 bullet : [0, 0] 
	      });

Crafty.c('Bullet', {
	     init : function() {
		 this.requires('Collision');
	     },
	     Bullet : function(direction_rad, speed, lifetime, shooter) {
		 var d = Trig.to_movement(direction_rad, speed);
		 var end_frame = Crafty.frame() + lifetime;
		 return this
		     .bind('EnterFrame', function(e) {
		 	       this.attr('x', this.x + d.x);
		 	       this.attr('y', this.y + d.y);
			       if(e.frame > end_frame)
				   this.destroy();
			       return;
		 	   })
		     .onHit('target', function(hits) {
				var killed = false;
				for(var i in hits) {
				    if (!(hits[i].obj === shooter)) {
					hits[i].obj.shot();
					killed = true;
				    }
				}
				if (killed)
				    this.destroy();
			    });
	     }
	 });

Crafty.c('TrooperControl', {
	     init : function() {
		 this.requires('Keyboard, Multiway');
	     }
	     , TrooperControl : function() {
		 var current_direction_rad = 0;
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
			       this.trigger('trooper.shoot', current_direction_rad);
			   });
	     }
});

Crafty.c('target', {
	     init : function() {
		 this.requires('Collision');
	     }
	 });

Crafty.c('ai_trooper', {
	     init : function() {
		 this.requires("SpriteAnimation, target");
	     }
	     , ai_trooper : function() {
		 return this;
	     }
	     , shot : function() {
		 this.stop();
		 this.destroy();
	     }
	 });

Crafty.c('trooper', { 
	     init : function() {
		 this.requires("SpriteAnimation, target, TrooperControl");
	     },
	     trooper :  function() {
		 var last_shot_ms = 0;
		 var shoot_delay_ms = 300;
		 var deviation_rad = 0.2;

		 return this.animate("walk", 0, 0, 3)
		     .TrooperControl()
		     .bind('trooper.shoot', function(direction) {
			       var current_time = new Date().getTime();
			       if (last_shot_ms + shoot_delay_ms < current_time) {
				   last_shot_ms = current_time;
			     	   Crafty.e('2D, DOM, bullet, Bullet')
				       .attr({ x: this.x + 3 , y: this.y + 5, z: 3 })
				       .Bullet(Trig.fuzzy_angle(direction, deviation_rad)
					       , 5
					       , 30
					       , this);
			       }
  			   })
		     .bind("NewDirection", function(direction) {
			       if (!direction.x && !direction.y)
				   this.stop();
			       else
				   this.stop().animate("walk", 20, -1);
			   });
	     }
	 });
