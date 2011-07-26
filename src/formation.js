Crafty.c("Formation", { 
	     Formation : function() {
		 var self = this;
		 var formations = {
		     abreast : function(troopers) {
			 var abreast_of = self;
			 for (var i in troopers) {
			     var abreast = Crafty(troopers[i]).aiAbreast;
			     if (abreast) {
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