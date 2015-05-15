var Vec2 = require('ks-vector').Vector2;
//var TIME_STEP = require('./constants.js').TIME_STEP;

class AngleConstraint {
	constructor(a, b, c, stiffness) {
		this.a = a;
		this.b = b;
		this.c = c;

		this.angle = this.getAngle(this.a.pos, this.b.pos, this.c.pos);
		this.stiffness = stiffness;
	}

	getAngle(a, b, c){
		var vecAFromB = a.copy().subtract(b);
		var vecCFromB = c.copy().subtract(c);
		var angle = Math.atan2( vecAFromB.x * vecCFromB.y - vecAFromB.y * vecCFromB.x, vecAFromB.x * vecCFromB.x + vecAFromB.y * vecCFromB.y );

		return angle;
	}

	rotate( vec, origin, theta){
		var x = vec.x - origin.x;
		var y = vec.y - origin.y

		var xPos = x * Math.cos(theta) - y * Math.sin(theta) + origin.x;
		var yPos = x * Math.sin(theta) + y * Math.cos(theta) + origin.y;

		return new Vec2(xPos, yPos);
	}

	relax(stepCoef){
		var angle = this.getAngle(this.a, this.b, this.c);
		var diff = angle - this.angle;

		if(diff <= -Math.PI)
			diff += 2 * Math.PI;
		else if(diff >= Math.PI)
			diff -= 2 * Math.PI;

		diff *= stepCoef * this.stiffness;

		this.a.pos = this.rotate( this.a.pos, this.b.pos,  diff );
		this.c.pos = this.rotate( this.c.pos, this.b.pos, -diff );
		this.b.pos = this.rotate( this.b.pos, this.a.pos,  diff );
		this.b.pos = this.rotate( this.b.pos, this.c.pos, -diff );
	}
}

module.exports = AngleConstraint;
