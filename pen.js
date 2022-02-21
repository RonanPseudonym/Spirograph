class Pen {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.c = 0;

		this.c_r = 0;
		this.c_g = 0;
		this.c_b = 0;

		this.size = 1;
		this.equations = [];

		this.old_pos;
	}

	to_p5_coords() {
		return {"x" : (this.x * 200) + 400, "y" : (-(this.y * 200) + 200)};
	}

	to_cartesian_coords() {
		return {"x" : (this.x), "y" : (this.y) + 200};
	}

	to_unit_coords(radius) {
		let c = this.to_cartesian_coords();

		c.x /= radius;
		c.y /= radius;

		return c;
	}

	distance_to_center() {
		let p5coords = this.to_p5_coords();
		
		let x = 400 - p5coords.x;
		let y = 400 - p5coords.y;

		return sqrt(x * x + y * y);
	}

	pos_from_angle(angle) {
		return {"x": cos(angle * (Math.PI / 180)), "y": -sin(angle * (Math.PI / 180))};
	}

	distance(x1, x2, y1, y2) {
		return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
	}

	angle_given_point(x, y) { // This took me *hours*. I don't know how it works or why it works, but it works and i never want to talk about it again
		// let a_l = [[0, 0], [0, radius]];
		// let b_l = [[0, 0], [x * radius, y * radius]];
		// let c_l = [[0, radius], [x * radius, y * radius]];

		// let a = this.distance(a_l[0][0], a_l[1][0], a_l[0][1], a_l[1][1]);
		// let b = this.distance(b_l[0][0], b_l[1][0], b_l[0][1], b_l[1][1]);
		// let c = this.distance(c_l[0][0], c_l[1][0], c_l[0][1], c_l[1][1]);

		let n = -((atan2(x, -y) * (180 / Math.PI)) - 180);
		return n;

		// console.log(this.theta_given_sides(a, b, c));

		// return this.theta_given_ab(a, b);
	}

	// theta_given_sides(a, b, c) {
	// 	// console.log(a, b, c);
	// }

	counteract_rotation() {
		let radius = this.distance_to_center(this.x, this.y);
		let circle_coords = this.to_unit_coords(radius);
		let current_degrees = this.angle_given_point(circle_coords.x, circle_coords.y);
		let combined_degrees = current_degrees - this.c;
		let mapped_to_unit_circle = this.pos_from_angle(combined_degrees);
		let mapped_scaled = {"y": mapped_to_unit_circle.x * -radius, "x": mapped_to_unit_circle.y * -radius};

		return mapped_scaled;
	}

	get_stroke() {
		let all = []
		let new_pos = this.counteract_rotation();

		if (this.old_pos === undefined) {
			this.old_pos = new_pos;
		}

		let offset = {'x': this.old_pos.x - new_pos.x, 'y': this.old_pos.y - new_pos.y}; // don't think order matters?
		let angle = this.angle_given_point(offset.x, offset.y) + 90;
		if (angle > 360) angle -= 360;
		let length = ceil(this.distance(new_pos.x, this.old_pos.x, new_pos.y, this.old_pos.y));
		let pos = {'x': new_pos.x, 'y': new_pos.y};

		if (this.distance(new_pos.x, 0, pos.y, -1) > 401) {
			return all;
		}

		for (let i = 0; i < length; i ++) {
			let unit_xy = this.pos_from_angle(angle);
			pos.x += unit_xy.x;
			pos.y += unit_xy.y;

			all.push(JSON.parse(JSON.stringify(pos))); // i hate javascript
		}


		this.old_pos = new_pos;

		return all;
	}

	update() {
		this.c ++;

		let parser = math.parser()
    
	    parser.eval("c="+this.c+";x="+this.x+";y="+this.y+";cl_r="+this.c_r+";cl_g="+this.c_g+";cl_b="+this.c_b+";size="+this.size);

    	for (let i = 0; i < this.equations.length; i ++) {
    		try {
    			parser.eval(this.equations[i]);
    		} catch {
    			// faulty equation
    		}
    	}

	    let vars = parser.eval("c\nx\ny\ncl_r\ncl_g\ncl_b\nsize").entries;

	    this.c = vars[0];
	    this.x = vars[1];
	    this.y = vars[2];
	    this.c_r = vars[3];
	    this.c_g = vars[4];
	    this.c_b = vars[5];
	    this.size = vars[6];
	}
}