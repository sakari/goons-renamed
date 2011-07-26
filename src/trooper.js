Crafty.sprite(6, 16, "sprites/blue_trooper.png", {
		  blue_trooper : [0, 0],
		  blue_trooper_in_cover : [7, 0]
	      });

Crafty.sprite(6, 16, "sprites/red_trooper.png", {
		  red_trooper : [0, 0],
		  red_trooper_in_cover : [7, 0]
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
//##src/formation.js
Crafty.c('TrooperControl', {
	     init : function() {
		 this.requires('Keyboard, KeyboardDirections, Formation');
	     }
	     , TrooperControl : function() {
		 var in_cover = false;
		 var formations = { abreast : "abreast", line : "line" };
		 var formation = undefined;
		 var directions = { UP_ARROW : 'up', DOWN_ARROW : 'down', RIGHT_ARROW : 'right', LEFT_ARROW : 'left'};
		 return this
		     .Formation()
		     .KeyboardDirections(directions, this._trooper.speed, 50)
 		     .bind('KeyDown', function(e) {
		     	       if (e.key == Crafty.keys.A) {
		     		   this.trigger('trooper.shoot', this.direction());
		     	       } else if (e.key === Crafty.keys.O) {
				   if (!in_cover) {
				       this.formation("hold", Crafty("ai_trooper"));
				       this.trigger('trooper.takeCover');
				       Crafty("ai_trooper").trigger('trooper.takeCover');
				   } else {
				       this.trigger('trooper.fromCover');
				       Crafty("ai_trooper").trigger('trooper.fromCover');
				   }
		     		   in_cover = !in_cover;     		   
		     	       } else if (e.key === Crafty.keys.E) {
				   if (formation === "line") {
				       formation = formations.abreast;
				   }
				   else {
				       formation = formations.line;
				   }
				   this.formation(formation, Crafty("ai_trooper"));
			       }
		     	   })
		     .bind('Moving', function(moving) {
			       if (moving) in_cover = false;
			   });
	     }
	 });

Crafty.c('target');
Crafty.c("blue");
Crafty.c("red");

//##src/ai.js
Crafty.c("enemy_trooper", {
	     init : function() {
		 this.requires("SpriteAnimation, trooper, red");
	     }, enemy_trooper : function() {
		 return this
		     .trooper();
	     }
	 });

Crafty.c('ai_trooper', {
	     init : function() {
		 this.requires("SpriteAnimation, blue, trooper, AiAttack, AiFollow, AiAbreast");		 
	     }
	     , ai_trooper : function() {
		 return this
		     .trooper()
		     .AiFollow(this._trooper.speed)
		     .AiAbreast()
		     .AiAttack("red", "blue", 200);
	     }
	 });

Crafty.c('ViewCenter', {
	     ViewCenter : function(lookahead_distance, 
				   correction_speed, 
				   world_dimensions) {
		 var viewport = {
		     x : 0, y : 0
		 };
		 var self = this;
		 var world = Crafty("World");

		 function viewport_component(d, 
					     window_size, 
					     component, 
					     world_size) {
		     var center = Math.round(window_size / 2);
		     var d = viewport[component] + d[component];
		     var vp = - self[component] + center - d;
		     if (vp > 0) {
			 d = viewport[component];
			 vp = 0;
		     } else if (vp - window_size < -world_size ) {
			 d = viewport[component];
			 vp = window_size - world_size;
		     }
		     viewport[component] = d;
		     return vp;
		 }

		 this.viewport = function() {
		     var target_viewport_center = Trig.point_at_direction(this.direction(), 
									  lookahead_distance);
		     var d = Trig.to_movement(Math.atan2(target_viewport_center.y - viewport.y, 
							 target_viewport_center.x - viewport.x), 
					      correction_speed);
		     Crafty.viewport.x = viewport_component(d, 
							    Crafty.DOM.window.width,
							    "x", 
							    world_dimensions.width); 
		     Crafty.viewport.y = viewport_component(d, 
							    Crafty.DOM.window.height,
							    "y", 
							    world_dimensions.height);
		     return this;  
		 };

		 this.viewport();
		 return this.bind('Moved', function(old_position) {
				     this.viewport(); 
				  });
	     }
	 });

Crafty.c('player_trooper', { 
	     init : function() {
		 this.requires("trooper, TrooperControl, ViewCenter, blue");
	     }
	     , player_trooper : function() {
		 return this
		     .trooper()
		     .ViewCenter(20, 1, 
				 Crafty.settings.get('goons.world.dimensions'))
		     .TrooperControl();
	     } 
	 });

Crafty.c('trooper', { 
	     init : function() {
		 this.requires("SpriteAnimation, target, Moving, Direction");
		 this._trooper = { speed : 1 };
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
			       this.moving(0);
			       if (!covering)
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
