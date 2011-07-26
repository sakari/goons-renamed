Crafty.c("Formation", { 
	     Formation : function() {
		 var self = this;
		 var formations = {
		     hold : function(troopers) {
			 for (var i in troopers) {
			     if (Crafty(troopers[i]).aiAbreast) 
				 Crafty(troopers[i]).aiAbreast.stop();
			     if (Crafty(troopers[i]).aiFollow)
				 Crafty(troopers[i]).aiFollow.stop();
			     Crafty(troopers[i]).trigger('trooper.takeCover');
			 }
		     },
		     abreast : function(troopers) {
			 var abreast_of = self;
			 for (var i in troopers) {
			     var abreast = Crafty(troopers[i]).aiAbreast;
			     if (abreast) {
				 Crafty(troopers[i]).trigger('trooper.fromCover');
				 abreast.abreast(abreast_of, 50, 1);
				 abreast_of = Crafty(troopers[i]);
			     }
			 }
 		     },
		     line : function(troopers) {
			 var follow_this = self;
			 for (var i in troopers) {
			     var follow = Crafty(troopers[i]).aiFollow;
			     if (follow) {
				 Crafty(troopers[i]).trigger('trooper.fromCover');
				 follow.follow(follow_this, 50);
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