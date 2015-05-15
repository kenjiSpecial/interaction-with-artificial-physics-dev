var Vec2 = require('ks-vector').Vector2;

/**
*
*/
class PinConstraint {
	/**
	* @param {Number} a
	* @param {Vec2} pos
	*/
	constructor(a, pos) {
		this.a = a;
		this.pos = pos;
	}

	relax(stepCoef) {
		this.a.pos = this.pos.copy();
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, 6, 0, 2*Math.PI);
		ctx.fillStyle = "rgba(0,153,255,0.1)";
		ctx.fill();
	}
}

module.exports = PinConstraint;
