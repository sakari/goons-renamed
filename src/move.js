
Crafty.c('Direction', {
	     init : function() {
		 var dir = undefined;
		 var self = this;
		 this.direction = function(set_dir) {
		     if (set_dir !== undefined) { 
			 if (dir !== set_dir) {
			     dir = set_dir;
			     self.trigger('Direction', dir);
			 }
			 return self;
		     }
		     return dir;
		 };
	     },
	     Direction : function() {}
	 });

Crafty.c("Moving", {
	     init : function() {},
	     Moving : function() {
		 var d = { x : 0, y : 0 };
		 var speed = 0;
		 var enabled = true;
		 var self = this;

		 function setMovement(direction) {
		     if (speed === 0) {			 
			 d = { x : 0, y : 0};
		     } else {
			 d = Trig.to_movement(direction, speed);
		     }
		     self.trigger('Moving', d);
		 }
		 this.moving = function(set_speed) {
		     speed = set_speed;
		     setMovement(self.direction());
		 };
		 return this
		     .bind('EnterFrame', function() {
			       if(d.x !== 0 || d.y !== 0) {
				   this.x += d.x;
				   this.y += d.y;
				   this.trigger('Moved', {x: this.x - d.x, y: this.y - d.y});
			       }
			   })
		     .bind('Direction', function(dir) {
			       setMovement(dir);
			   });
	     }
	 });

Crafty.c("KeyboardDirections", {
	     KeyboardDirections : function(keyNamesToArrows, speed, keyUpDelay_ms) {
		 var fstKey, sndKey;
		 var keysToArrows = {};
		 for (var k in keyNamesToArrows) {
		     keysToArrows[Crafty.keys[k]] = keyNamesToArrows[k];
		 }
		 var arrows = {};
		 function downKey(key) {
		     arrows = {};
		     if (fstKey) {
			 sndKey = fstKey;
			 arrows[keysToArrows[sndKey]] = true;
		     }
		     fstKey = key;
		     arrows[keysToArrows[fstKey]] = true;
		 }
		 function upKey(key) {
		     if (sndKey === key) {
			 delete arrows[keysToArrows[sndKey]];
			 sndKey = undefined;
		     } else if (fstKey === key) {
			 delete arrows[keysToArrows[fstKey]];
			 fstKey = sndKey;
			 sndKey = undefined;
		     }
		 }
		 function downKeysToDirections() {
		     if (arrows.down && arrows.left)
			 return Math.PI * 3 / 4;
		     if (arrows.down && arrows.right)
			 return Math.PI / 4;
		     if (arrows.up && arrows.left)
			 return Math.PI * 5 / 4;
		     if (arrows.up && arrows.right)
			 return Math.PI * 7 / 4;
		     if (arrows.up)
			 return Math.PI * 3 / 2;
		     if (arrows.down)
			 return Math.PI / 2;
		     if (arrows.left)
			 return Math.PI;
		     if (arrows.right)
			 return 0;
		     return this.direction();
		 }
		 return this
		     .bind("KeyDown", function(e) {
			       if (!keysToArrows[e.keyCode])
				   return;
			       downKey(e.keyCode);
			       this.direction(downKeysToDirections());
			       this.moving(speed);
			   })
		     .bind("KeyUp", function(e) {
			       if (!keysToArrows[e.keyCode])
				   return;
			       upKey(e.keyCode);
			       if (fstKey === undefined && sndKey === undefined) {
				   this.moving(0);				   
			       }
			       else {
				   this.delay(function() {
				   		  this.direction(downKeysToDirections());
				   	      }, keyUpDelay_ms);
			       }
			   });
	     }
	 });

