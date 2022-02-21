let count = 0;
let speed = 1;
let ipf = 3;
let pens = [];

function preload() {
	img = loadImage("assets/plate.png");
}

function setup() {
	var canvas = createCanvas(400, 400);

	pens.push(new Pen(0, 0));

	render_eq();
}

function clear_screen() {
	img = loadImage("assets/plate.png");
}

function draw() {
	count += 1;
	background(color(250, 250, 250));
	translate(width / 2, height / 2);
	img.loadPixels();

	for (let i = 0; i < ipf; i ++) {
		rotate(PI / 180 * count * speed);
		imageMode(CENTER);

		for (let j = 0; j < pens.length; j ++) {
			pens[j].update();

			let pos = pens[j].counteract_rotation(count);

			brush = pens[j].get_stroke()

			for (let k = 0; k < brush.length; k ++) {
				img.set(brush[k].x + 400, brush[k].y + 400, color(pens[j].c_r, pens[j].c_g, pens[j].c_b));
			}	
		}		
	}

	img.updatePixels();
	image(img, 0, 0, 400, 400);
}