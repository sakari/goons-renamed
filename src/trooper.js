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
		 this.requires('Keyboard, KeyboardDirections');
	     }
	     , TrooperControl : function() {
		 var in_cover = false;
		 var directions = { UP_ARROW : 'up', DOWN_ARROW : 'down', RIGHT_ARROW : 'right', LEFT_ARROW : 'left'};
		 return this
		     .KeyboardDirections(directions, 1, 50)
 		     .bind('KeyDown', function(e) {
		     	       if (e.key == Crafty.keys.A) {
		     		   this.trigger('trooper.shoot', this.direction());
		     	       } else if (e.key === Crafty.keys.O) {
				   if (!in_cover) {
				       this.moving(0);
				       this.trigger('trooper.takeCover');				       
				   } else {
				       this.trigger('trooper.fromCover');
				   }
		     		   in_cover = !in_cover;     		   
		     	       }
		     	   })
		     .bind('Moving', function(moving) {
			       if (moving) in_cover = false;
			   });
	     }
	 });

Crafty.c('target', {
	     init : function() {
		 this.requires('Collision');
	     }
	 });

//##src/ai.js

Crafty.c('ai_trooper', {
	     init : function() {
		 this.requires("SpriteAnimation, trooper, AiFollow, AiAbreast");		 
	     }
	     , ai_trooper : function() {
		 return this
		     .trooper()
		     .AiFollow()
		     .AiAbreast();
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
		 this.requires("SpriteAnimation, target, Moving, Direction");
	     },
	     trooper :  function() {
		 var covering = false;
		 var last_shot_ms = 0;
		 var shoot_delay_ms = 500;
		 var deviation_rad = 0.2;
		 
		 return this
		     .Moving()
		     .animate("walk", 0, 0, 3)
		     .animate("takeCover", 4, 0, 7)
		     .bind('shot', function() {
			       this.stop();
			       this.destroy();
			   })
		     .bind('trooper.fromCover', function() {
			       this.stop().animate("walk", 30);
			       covering = false;
			   })
		     .bind('trooper.takeCover', function() {
			       this.stop().animate("takeCover", 10);
			       covering = true;
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
		     .bind("Moving", function(d) {
			       if (d) {
				   this.stop().animate("walk", 20, -1);
			       }				   
			       else {
				   this.stop();
			       }
				   
			   });
	     }
	 });
