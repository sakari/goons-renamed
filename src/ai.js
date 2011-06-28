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
			 self.aiFollow.follow(target_point, 10, speed);
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
		 return this.AiFollow();
	     }
	 });

Crafty.c('AiFollow', {
	     init : function() {
		 var self = this;
		 var follow_target;
		 var distance;
		 var follow_speed; 
		 
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
