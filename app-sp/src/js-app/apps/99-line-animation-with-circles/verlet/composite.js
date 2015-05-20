var Vec2 = require('ks-vector').Vector2;
var PinConstraint = require('./constraints/pin.js');

class Composite {
	constructor() {
		this.particles = [];
		this.constraints = [];

		this.drawParticles = null;
		this.drawConstraints = null;
	}

	pin(index, pos){
		pos = pos || this.particles[index].pos.copy();
		var pc = new PinConstraint(this.particles[index], pos);
		this.constraints.push(pc);
		return pc;
	}
};

module.exports = Composite;
