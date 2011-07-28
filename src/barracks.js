Crafty.sprite(24, 32, 'sprites/barracks.png', 
		 { barracks_sprite : [0, 0]});
Crafty.c('Barracks', {
		init : function() {
		    return this.requires('2D, DOM, barracks_sprite, red, target');
		},
		Barracks : function(interval_ms) {
		    var self = this;
		    function createTrooper() {
			Crafty.e("2D, DOM, red_trooper, enemy_trooper")
			    .attr({ x : self.x + self.w / 2, y : self.y + self.h })
			    .enemy_trooper();
			self.delay(createTrooper, interval_ms);
		    }
		    this.is_shot = function() {
			return true;
		    };
		    createTrooper();
		    return this;
		}		    
	    });