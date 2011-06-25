var Trig = {
    to_movement : function(angle_rad, speed) {
	return { x: Math.round(Math.cos(angle_rad) *1000 * speed)/1000,
		 y: Math.round(Math.sin(angle_rad) *1000 * speed)/1000 };
    },
    fuzzy_angle : function(angle_rad, deviation_rad) {
	return angle_rad - deviation_rad + Math.random() * deviation_rad * 2;
    }
};