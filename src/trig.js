var Trig = {
    point_at_direction : function(angle_rad, distance) {
	return {
	    x : Math.round(Math.cos(angle_rad) * distance),
	    y : Math.round(Math.sin(angle_rad) * distance)
	};
    },
    rad_difference : function(rad_a, rad_b) {
	return Math.abs((rad_a - rad_b)) % (Math.PI * 2);
    },
    in_funnel : function (origin, origin_direction, target, funnel_width) {
	var direction_to_target = Trig.angle_from(origin, target);
	return Trig.rad_difference(origin_direction, direction_to_target) < (funnel_width / 2); 
    },
    angle_from : function(point_from, point_to) {
	return Math.atan2(point_to.y - point_from.y, point_to.x - point_from.x);
    },
    to_movement : function(angle_rad, speed) {
	return { x: Math.round(Math.cos(angle_rad) *1000 * speed)/1000,
		 y: Math.round(Math.sin(angle_rad) *1000 * speed)/1000 };
    },

    fuzzy_angle : function(angle_rad, deviation_rad) {
	return angle_rad - deviation_rad + Math.random() * deviation_rad * 2;
    },

    distance : function(point_a, point_b) {	
	return Math.sqrt(Math.pow(point_a.x - point_b.x, 2) + Math.pow(point_a.y - point_b.y, 2));
    }
};