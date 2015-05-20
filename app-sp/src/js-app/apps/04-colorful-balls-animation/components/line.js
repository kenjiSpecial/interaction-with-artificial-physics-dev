var Plane = require('./plane.js');

var Line = function(x1, y1, x2, y2) {
	Plane.call(this, 0, 0, 0);
	this.pos.set( (x1 + x2)/2, (y1 + y2)/2 );



	this.halfMinusExtent.set( (x1 - this.pos.x), (y1 - this.pos.y) );
	this.halfPluseExtent.set( (x2 - this.pos.x), (y2 - this.pos.y) );

	console.log(this.pos);
}

Line.prototype = Object.create(Plane.prototype);
Line.prototype.constructor = Line;

module.exports = Line;
