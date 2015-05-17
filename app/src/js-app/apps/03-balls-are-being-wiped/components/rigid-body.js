var Vector2 = require('ks-vector').Vector2;
var Matrix = require('./matrix23.js');
var CONSTANTS = require('./constants.js');

/**
* @param {Number}  mass
* @param {Number}  width
* @param {Number}  height
* @param {Vector2} posVector
* @param {Vector2} velVector
*/
var RigidBody = function( mass, width, height, pos, vel ) {
  //if(!instanceOf velVector) this.velVector =
  this.mass = mass;
  if(this.mass == 0) this.invMass = 0;
  else               this.invMass = 1 / mass;

  this.matrix = new Matrix();

  this.width = width;
  this.height = height;

  this.angle = 0;
  this.angularVel = 0;

  this.pos = pos;
  this.vel = vel;

  this.force = new Vector2(0, 0);
}

RigidBody.prototype.update = function(dt) {

  // --------------------
  this.angle += this.angularVel * dt;

  // ====================

  this.pos.x += this.vel.x * dt;
  this.pos.y += this.vel.y * dt;

  // ====================

  this.force.set(0, 0);
};

RigidBody.prototype.setForce = function( xx, yy) {
  this.force.x += xx;
  this.force.x += xx;
};

RigidBody.prototype.setGravity = function() {
  this.force.y += this.mass * CONSTANTS.gravity;
};

RigidBody.prototype.getClosestPoints = function(rb) {
  console.error("===== NO getClosestPoints IN RigidBody =====");
};

RigidBody.prototype.generateMotionAABB = function(dt) {

};

Object.defineProperty(RigidBody.prototype, "pos", {
  get : function() {
    return this.matrix.pos;
  },

  set : function(vector) {
    this.matrix.pos = vector;
  }
});

Object.defineProperty(RigidBody.prototype, 'angle', {
  get : function(){
    return this.matrix.angle;
  },

  set : function(angle) {
    this.matrix.setAngle(angle);
  }

});



module.exports = RigidBody;
