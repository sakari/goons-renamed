Crafty.c('AiAttack', {
	     init : function() {
		 return this.requires("Collision");
	     }, 
	     AiAttack : function(enemy, friend, attack_range) {
		 var funnel_rad = 0.8;
		 var self = this;
		 var attack_area_entity = Crafty.e("2D, DOM, Collision")
		     .attr({w : attack_range * 2, h : attack_range * 2, 
			    x : this.x - attack_range, y : this.y - attack_range })
		     .onHit("target", function(hits){
				var shoot = false;
				for (var i in hits) {				    
				    if (Trig.in_funnel(self, self.direction(), hits[i].obj, funnel_rad)) {
					if (hits[i].obj.has(enemy)) {
					    shoot = true; 
					} else if (hits[i].obj.has(friend)) {
					    return;
					}					
				    }
				}
				if (shoot)
				    self.trigger('trooper.shoot', self.direction());
			    });
		 function update_attack_area() {
		     attack_area_entity.x = self.x - attack_range;
		     attack_area_entity.y = self.y - attack_range;
		 }
		 return this.bind('Moved', update_attack_area);
	     }
	 });

Crafty.c('AiAbreast', {
	     init : function() {
		 var self = this;
		 var abreast_distance;
		 var follow_speed;
		 var target_point = { x : 0, y : 0 };
		 var center_point;

		 this.requires('AiFollow');

		 function targetTracker() {
		     var abreast_angle = center_point.direction() - Math.PI / 2;
		     var old_target_point = {
			 x : target_point.x,
			 y : target_point.y
		     };
		     target_point.x =  Math.cos(abreast_angle) * abreast_distance + center_point.x;
		     target_point.y = Math.sin(abreast_angle) * abreast_distance + center_point.y;
		 }

		 this.aiAbreast = {
		     abreast : function(center, distance_min, speed) {
			 abreast_distance = distance_min;
			 center_point = center;
			 targetTracker();
			 self.aiFollow.follow(target_point, 0.5, speed);
			 center_point.bind('Moved', targetTracker);
			 return self;
		     }, 
		     stop : function() {
			 self.aiFollow.stop();
			 center_point.unbind('Moved', targetTracker);
			 return self;
		     }
		 };
		 return this;
	     },

	     AiAbreast : function() {
		 return this;
	     }
	 });

Crafty.c('AiFollow', {
	     init : function() {
	     }
	     , AiFollow : function(follow_speed) {
		 var self = this;
		 var follow_target;
		 var distance;
		 
		 function frameFunc() {
		     var current_distance = Trig.distance(follow_target, self);
		     if (current_distance < distance) {
			 self.moving(0);
			 return;
		     }
		     self.direction(Math.atan2(follow_target.y - self.y, 
					       follow_target.x - self.x));
		     self.moving(follow_speed);
		 }
		 self.aiFollow = {
		     follow : function(target, distance_min) {
			 if (follow_target !== undefined)
			     self.unbind('EnterFrame', frameFunc);
			 follow_target = target;
			 distance = distance_min;
			 return self.bind('EnterFrame', frameFunc);
		     }
		     , stop : function() {
			 if(follow_target !== undefined)
			     self.unbind('EnterFrame', frameFunc);
			 return self;
		     }
		 };
		 return this;
	     }
	 });
