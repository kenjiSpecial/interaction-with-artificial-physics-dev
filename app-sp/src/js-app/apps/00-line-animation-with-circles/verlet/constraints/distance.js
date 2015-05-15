var Vec2 = require('ks-vector').Vector2;

class DistanceConstraints {
	constructor( a, b, stiffness, distance ) {
		this.a = a;
		this.b = b;
		this.distance = typeof distance != "undefined" ? distance : a.pos.copy().subtract(b.pos).getLength();
		this.stiffness = stiffness;
	}

	relax(stepCoef){
		var normal = this.a.pos.copy().subtract(this.b.pos);
		var m = normal.getSquareLength();
		normal.multiply( ((this.distance * this.distance - m) / m) * this.stiffness * stepCoef );
		this.a.pos.add(normal);
		this.b.pos.subtract(normal);
	}

	draw(ctx, alpha){
		ctx.beginPath();
		ctx.moveTo(this.a.pos.x, this.a.pos.y);
		ctx.lineTo(this.b.pos.x, this.b.pos.y);

		ctx.strokeStyle = "rgba(0, 0, 0, "+alpha+")";
		ctx.stroke();
	}
}

module.exports = DistanceConstraints;
