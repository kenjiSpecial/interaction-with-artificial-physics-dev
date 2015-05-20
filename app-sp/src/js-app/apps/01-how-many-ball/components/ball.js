var constants = require('./constants.js');
var Vector2   = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Floor     = require('./rectangle.js');
var Plane     = require('./plane.js');
var Contact   = require('./contact.js');
var utils     = require('./utils.js');
var AABB      = require('./aabb.js');


/**
* @param {Number}  _mass
* @param {Number}  _rad
* @param {Vector2} _pos
* @param {Vector2} _vel
*/
var Ball = function( _mass, _rad, _pos, _vel ) {
  RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
  this.rad = _rad;

  if(this.invMass > 0){
    var I = this.mass * this.rad * this.rad / 4;
    this.invI = 1 / I;
  }else{
    this.invI = 0;
  }

};

Ball.prototype = Object.create(RigidBody.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function( dt ) {

  RigidBody.prototype.setGravity.call(this);

  this.vel.x += this.force.x * this.invMass;
  this.vel.y += this.force.y * this.invMass;

  // console.log(this.vel);


  RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.draw = function(ctx) {

  ctx.save();

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);

  ctx.fillStyle = "#000000"
  ctx.beginPath();
  ctx.arc( 0, 0, this.rad, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo( -5, 0);
  ctx.lineTo(  5, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(0, 5);
  ctx.stroke();

  ctx.restore();

};

Ball.prototype.reset = function() {
  this.pos = new Vector2(window.innerWidth/2 - 100 + 200 * Math.random(), -this.rad * 2 - 400 * Math.random());
  this.vel = new Vector2();
}

Ball.prototype.getClosestPoints = function(rBody) {
  var contacts = [];
  var ballA = this;

  if(rBody instanceof Ball){

    var ballB = rBody;

    var delata = new Vector2( ballB.pos.x - ballA.pos.x, ballB.pos.y - ballA.pos.y );
    var n;

    if( delata.getLength() ){
      n = delata.getNormal();
    }else{
      n = new Vector2(1, 0);
    }

    // generate closes points
    var pa = new Vector2(ballA.pos.x + n.x * ballA.rad, ballA.pos.y + n.y * ballA.rad);

    var pb = new Vector2( ballB.pos.x - n.x * ballB.rad, ballB.pos.y - n.y * ballB.rad);

    // getdistance
    var dist = delata.getLength() - (ballA.rad + ballB.rad);

    contacts.push(new Contact( ballA, ballB, pa, pb, n, dist ));

  }else if(rBody instanceof Floor){
    var rectangleB = rBody;

    contacts = rectangleB.getClosestPoints(this);
    utils.flipContacts(contacts);

  }else if(rBody instanceof Plane){
    //var plane
    var planeB = rBody;
    contacts = planeB.getClosestPoints(ballA);
  }else{
    console.error("===== NO getClosestPoints IN Ball =====");
  }

  return contacts;
};

// ----------------------

Ball.prototype.generateMotionAABB = function(dt) {
  var boundsNow = AABB.buildAABBCircle( this.rad, this.pos );
  var nextPos = this.pos.copy().addMultipledVector( dt, this.vel );
  var boundsNextFrame = AABB.buildAABBCircle( this.rad, nextPos );

  this.motionBounds = new AABB();
  this.motionBounds.setAABB( boundsNow, boundsNextFrame );
};





module.exports = Ball;
