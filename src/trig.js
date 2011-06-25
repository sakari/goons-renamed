var Trig = {
    to_movement : function(angle_rad, speed) {
	return { x: Math.round(Math.cos(angle_rad) *1000 * speed)/1000,
		 y: Math.round(Math.sin(angle_rad) *1000 * speed)/1000 };
    }
};