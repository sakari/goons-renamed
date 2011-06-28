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
