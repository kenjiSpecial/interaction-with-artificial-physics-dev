var Vector2 = require('ks-vector').Vector2;

var Matrix23 = function(){
  this.angle = 0;
  this.row0 = new Vector2(1, 0);
  this.row1 = new Vector2(0, 1);
  this.pos  = new Vector2();
};


/**
* @param {Number} angle
*/

Matrix23.prototype.setAngle = function( angle ) {
  this.angle = angle;
  this.row0 = this.row0.fromAngle(angle);
  this.row1 = this.row0.perp();
}


/**
* @param {Number} angle
* @param {Vector2} pos
*/
Matrix23.prototype.setAngleAndPos = function( angle, pos) {
  this.setAngle(angle);
  this.pos  = pos;
};

// this.row0 = (cos(theta), sin(theta));
// this.row1 = (-sin(theta), cos(theta));

/**
* @param {Vector2} v
* @return {Vector2}
*/

Matrix23.prototype.RotateIntoSpaceOf = function( v ) {
  return new Vector2(v.copy().dotProduct(this.row0), v.copy().dotProduct(this.row1));
};

/**
* @param {Vector2}
* @return {Vector2}
*/

Matrix23.prototype.rotateBy = function( v ) {
  var vec0 = this.row0.copy().multiply(v.x);
  var vec1 = this.row1.copy().multiply(v.y);

  return vec0.add(vec1);
};

/**
* @param {Vector2} vec
* @return {Vector2}
*/
Matrix23.prototype.transformBy = function(vec) {
  return this.rotateBy(vec).add(this.pos);
};


module.exports = Matrix23;
