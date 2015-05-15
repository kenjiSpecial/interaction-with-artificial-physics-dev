var Vec2 = require('ks-vector').Vector2;

class Particle {
	constructor(xx, yy) {
		this.pos = new Vec2( xx, yy );
		this.lastPos = new Vec2( xx, yy );
	}
}

module.exports = Particle;
