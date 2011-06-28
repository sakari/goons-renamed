Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0],
		  blue_trooper_in_cover : [7, 0]
	      });
Crafty.sprite(3, "sprites/bullet.png", {
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
					hits[i].obj.trigger('shot');
					killed = true;
				    }
				}
				if (killed)
				    this.destroy();
			    });
	     }
	 });

//##src/move.js

Crafty.c('TrooperControl', {
	     init : function() {
		 this.requires('Keyboard, Moving, MoveCtrl');
	     }
	     , TrooperControl : function() {
		 var current_direction_rad = 0;
		 var in_cover = false;
		 var multiway_settings = { UP_ARROW : -90, DOWN_ARROW : 90, RIGHT_ARROW : 0, LEFT_ARROW : 180};
		 return this
		     .Moving()
		     .MoveCtrl(1, multiway_settings)
		     .bind("NewDirection", function(movement) {
		     	       if (movement.x || movement.y) {
		     		   current_direction_rad = Math.atan2(movement.y, movement.x);
		     	       }
		     	   })
 		     .bind('KeyDown', function(e) {
		     	       if (e.key == Crafty.keys.A) {
		     		   this.trigger('trooper.shoot', current_direction_rad);
		     	       } else if (e.key === Crafty.keys.O) {
				   if (in_cover) {
				       this.trigger('trooper.takeCover')
					   .moving.disable();				           
				   } else {
				       this.trigger('trooper.fromCover')
					   .moving.enable();
				   }
		     		   in_cover = !in_cover;     		   
		     	       }
		     	   });
	     }
	 });

Crafty.c('target', {
	     init : function() {
		 this.requires('Collision');
	     }
	 });

Crafty.c('AiFollow', {
	     init : function() {
		 var self = this;
		 var follow_target;
		 var distance;
		 var follow_speed; 
		 this.requires('AiMoveTowards');
		 
		 function frameFunc() {
		     var current_distance = Trig.distance(follow_target, self);
		     if (current_distance < distance) return;
		     var m = Trig.to_movement(Math.atan2(follow_target.y - self.y, follow_target.x - self.x), follow_speed); 
		     self.x += m.x;
		     self.y += m.y;
		 }
		 
		 self.aiFollow = {
		     follow : function(target, distance_min, speed) {
			 if (follow_target !== undefined)
			     self.unbind('EnterFrame', frameFunc);
			 follow_target = target;
			 distance = distance_min;
			 follow_speed = speed;
			 self.bind('EnterFrame', frameFunc);
			 return self;
		     }
		     , stop : function() {
			 if(follow_target !== undefined)
			     self.unbind('EnterFrame', frameFunc);
			 return self;
		     }
		 };
		 return this;
	     }
	     , AiFollow : function() {
		return this; 
	     }
	 });

Crafty.c('ai_trooper', {
	     init : function() {
		 this.requires("SpriteAnimation, trooper, AiFollow");		 
	     }
	     , ai_trooper : function() {
		 return this
		     .trooper()
		     .AiFollow();
	     }
	 });

Crafty.c('player_trooper', { 
	     init : function() {
		 this.requires("trooper, TrooperControl");
	     }
	     , player_trooper : function() {
		 return this
		     .trooper()
		     .TrooperControl();
	     } 
	 });

Crafty.c('trooper', { 
	     init : function() {
		 this.requires("SpriteAnimation, target");
	     },
	     trooper :  function() {
		 var last_shot_ms = 0;
		 var shoot_delay_ms = 300;
		 var deviation_rad = 0.2;

		 return this
		     .animate("walk", 0, 0, 3)
		     .animate("takeCover", 4, 0, 7)
		     .bind('shot', function() {
			       this.stop();
			       this.destroy();
			   })
		     .bind('trooper.fromCover', function() {
			       this.animate("walk", 30);
			   })
		     .bind('trooper.takeCover', function() {
			       this.animate("takeCover", 10);
			   })
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
