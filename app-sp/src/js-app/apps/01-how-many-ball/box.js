var BaseBox = require("./components/box.js");
var BaseRectangle = require('./components/rectangle.js');

var Vector2   = require('ks-vector').Vector2;

var Box = function(mass, x, y, wid, hig){
	mass = 0;
	this.mass = mass ;

	BaseBox.call(this, mass, x, y, wid, hig);
	var I = 10 * (this.width * this.width + this.height * this.height) / 12;
	this.invI = 1 / I;
};

Box.prototype = Object.create(BaseBox.prototype);
Box.prototype.constructor = Box;

Box.prototype.update = function(dt) {
	this.angle += this.angularVel * dt;
	this.angularVel *= .95;
};





module.exports = Box;
