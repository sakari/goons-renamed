Crafty.c("Formation", { 
	     Formation : function() {
		 var self = this;
		 var formations = {
		     abreast : function() {
		     },
		     line : function(troopers) {
			 var follow_this = self;
			 for (var i in troopers) {
			     var follow = Crafty(troopers[i]).aiFollow;
			     if (follow) {
				 Crafty(troopers[i]).aiFollow.follow(follow_this, 50);
				 follow_this = Crafty(troopers[i]);
			     }
			 }
		     }
		 };
		 this.formation = function(formation, troopers) {
		     formations[formation](troopers);
		 };
		 return this;
	     }
	 });