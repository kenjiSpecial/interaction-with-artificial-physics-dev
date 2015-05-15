var Vec2 = require('ks-vector').Vector2;

class Ball {
	constructor( x, y, rad ) {
		this.pos = new Vec2(x, y)
		this.rad = rad;
	}

	draw(ctx) {
		ctx.fillStyle = "#ff0000";
		ctx.beginPath();
		ctx.arc( this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}

module.exports = Ball;
