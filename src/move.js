
Crafty.c('Direction', {
	     init : function() {
		 var dir = 0;
		 this.direction = function() { return dir; };
		 return this.bind('Moved', function(old_position) {
				      dir = Math.atan2(this.y - old_position.y, this.x - old_position.x);
				  });
	     }
	 });


Crafty.c("Moving", {
	     Moving : function() {
		 var dx = 0;
		 var dy = 0;
		 var enabled = true;
		 var self = this;
		 this.moving = {
		     enable : function() {
			 enabled = true;
			 dx = 0;
			 dy = 0;
			 return self;
		     }, 
		     disable : function() {
			 enabled = false;
			 dx = 0; 
			 dy = 0;
			 return self;
		     },
		     move : function(set_dx, set_dy) {
			 if (!enabled) return self;
			 if (set_dx !== dx || set_dy !== dy) {
			     self.trigger('NewDirection', {x : set_dx, y : set_dy} );
			 }
			 dx = set_dx;
			 dy = set_dy;
			 return self;
		     }
		 };
		 return this.bind('EnterFrame', function() {
				      if(dx !== 0) {
					  this.x += dx;
					  this.trigger('Moved', {x: this.x - dx, y: this.y});
				      }
				      if(dy !== 0) {
					  this.y += dy;
					  this.trigger('Moved', {x: this.x, y: this.y - dy});
				      }			       
				  });
	     }
	 });

Crafty.c("MoveCtrl", {             
	     init: function() {
	     },
	     MoveCtrl: function(speed, keyDirections) {
		 var keys = {};
		 var movement = { x : 0, y : 0 };

		 function fillKeySpeeds(speed) {
		     for(var k in keyDirections) {
		 	 var keyCode = Crafty.keys[k] || k;
		 	 keys[keyCode] = { 
		 	     x: Math.round(Math.cos(keyDirections[k]*(Math.PI/180))*1000 * speed)/1000,
		 	     y: Math.round(Math.sin(keyDirections[k]*(Math.PI/180))*1000 * speed)/1000
		 	 };
		     }
		 }
		 fillKeySpeeds(speed);
		 
		 return this
		     .bind("KeyDown", function(e) {
			       if(keys[e.key]) {				   
		 		   movement.x = Math.round((movement.x + keys[e.keyCode].x)*1000)/1000;
		 		   movement.y = Math.round((movement.y + keys[e.keyCode].y)*1000)/1000;
				   this.moving.move(movement.x, movement.y);
		 	       }
		 	   })
		     .bind("KeyUp", function(e) {
		 	       if(keys[e.key]) {
		 		   movement.x = Math.round((movement.x - keys[e.keyCode].x)*1000)/1000;
		 		   movement.y = Math.round((movement.y - keys[e.keyCode].y)*1000)/1000;
		 		   this.moving.move(movement.x, movement.y);
		 	       }
		 	   });
	     }
	 });
