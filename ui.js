class Equation { // These really should inherit from a base class but ehhhhhh who cares polymorphism is cringe
	constructor(is_def, content, key) {
		this.is_def = is_def;
		this.content = content;
		this.children = [];
		this.key = key;
		this.last_biggest = 1;
	}

	get_html() {
		let data = '<li style="position: relative;" id="'+this.key.split("/")[0]+"slash"+this.key.split("/")[1]+'"><button onclick="delete_eq(\''+this.key+'\');"<i class="bi-trash3 delete" style="font-size: 1.3rem;"></i></button>';

		if (this.is_def) {
			data += '<i class="bi-boxes icon" style="font-size: 1.3rem;"></i>';
			data += '<button onclick="equation(false, \'\', \''+this.content+'\');"><i class="bi-plus-circle icon new" style="font-size: 1.3rem;"></i></button>';
			data += '<div class="pen-name">'+this.content+'</div>';
		} else {
			data += '<i class="bi-braces icon" style="font-size: 1.3rem;"></i>';
			data += '<span id="answer"></span>';
		}

		data += '</li>';

		return data;
	}
}

let last = "A";

let equations = [
	new Equation(true, "A", "A")
]

equations[0].children.push(new Equation(false, "y=\\sin\\left(\\frac{c}{100}\\right)", "A/0"));

function delete_eq(path) {
	split_path = path.split("/");
	let parent_i;

	for (let i = 0; i < equations.length; i ++) {
		if (equations[i].content == split_path[0]) {
			parent_i = i;
			break;
		}
	}

	if (split_path.length == 1) {
		equations.splice(parent_i, parent_i + 1);
	} else if (split_path.length == 2) { // Fix this later
		let child_i;
		for (let i = 0; i < equations[parent_i].children.length; i ++) {
			if (equations[parent_i].children[i].key.split("/")[1] == split_path[1]) {
				child_i = i;
				break;
			}
		}

		equations[parent_i].children.splice(child_i, child_i + 1);
	}

	render_eq(true);
}

function equation(is_def, name, parent_def = undefined) {
	if (name == "\\next") {
		name = String.fromCharCode(last.charCodeAt(0) + 1);
		last = name;
	}

	if (is_def) {
		equations.push(new Equation(is_def, name, name));
	} else {
		let parent;

		for (let i = 0; i < equations.length; i ++) {
			if (equations[i].content == parent_def) {
				parent = equations[i];
				break;
			}
		}

		console.log(parent.children);

		parent.children.push(new Equation(is_def, name, parent_def+"/"+parent.last_biggest));
		parent.last_biggest ++;
	}

	render_eq();
}

function render_eq(del = false) {
	let list = $("ul");
	list.empty();

	for (let i = 0; i < equations.length; i ++) {
		list.append(equations[i].get_html());

		if (equations[i].is_def) {
			for (let j = 0; j < equations[i].children.length; j ++) {
				list.append(equations[i].children[j].get_html());
			}
		}
	}

	answers = []

	for (let i = 0; i < equations.length; i ++) {
		for (let j = 0; j < equations[i].children.length; j ++) {
			let key_split = equations[i].children[j].key.split("/");
			let parent_eq = $("ul").find("#"+key_split[0]+"slash"+key_split[1]);
			let field = parent_eq.find("#answer");

			answers.push({field:MQ.MathField(field[0], {
			    handlers: {
			      edit: function() {
			        send_data(answers);
			      }}}), pen:i, index:j});
			answers[answers.length - 1].field.latex(equations[i].children[j].content);
		}
	}

	if (del)
		send_data(answers);

	// for (let i = 0; i < answers.length; i ++) {

	// }
}