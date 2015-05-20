var constants = require('./constants.js');
var Vector2   = require('ks-vector').Vector2;
var RigidBody = require('./rigid-body.js');
var Floor     = require('./rectangle.js');
var Plane     = require('./plane.js');
var Contact   = require('./contact.js');
var utils     = require('./utils.js');
var AABB      = require('./aabb.js');

var hsv2Rgb = require('./hsv2rgb');
var AppStore = require('../../../../js/stores/app-store');
var TweenLite = require('gsap');

var colS = 100;
var colV = 90;

/**
* @param {Number}  _mass
* @param {Number}  _rad
* @param {Vector2} _pos
* @param {Vector2} _vel
*/
var Ball = function( _mass, _rad, _pos, _vel, id ) {
  RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
  this.id = id;
  this.duration = 4000 + parseInt(Math.random() * 7000);
  this.rad = _rad;
  this.angular = 2 * Math.random();
  this.angularVel = 20 * (Math.random()  - .5);

  //var
  var rate = _pos.x / AppStore.getWindowWidth() * 360;
  var colVRate = _pos.y / AppStore.getWindowHeight() * colV;
  this.col = hsv2Rgb(rate, colS, colVRate);

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
  if(this.isDisable) return;

  RigidBody.prototype.setGravity.call(this);

  this.vel.x += this.force.x * this.invMass;
  this.vel.y += this.force.y * this.invMass;


  RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.start = function() {
  this.isDisable = false;
  this.cross = 5;
  this.duration = 2000 + parseInt(Math.random() * 3000);
  this.timerId = setTimeout(this.disableTimer.bind(this), this.duration);
};

Ball.prototype.disableTimer = function() {
    this.isDisable = true;
    this.cross = 5,
    TweenLite.to(this, .3, {rad : 0, cross: 0, ease: Power2.easeOut, onComplete: this.disableTimerComplete.bind(this)});
};

Ball.prototype.disableTimerComplete = function() {
  this.emit("removed", this.id);
}

Ball.prototype.reset = function( rad, xPos, yPos ) {
    this.pos.x = xPos;
    this.pos.y = yPos;

    this.vel.x = 0;
    this.vel.y = 30;
    this.rad = rad;
}

Ball.prototype.stop = function() {
  clearTimeout(this.timerId);
};

Ball.prototype.draw = function(ctx) {

  var rate = this.pos.x / AppStore.getWindowWidth() * 360;
  var colVRate = this.pos.y / AppStore.getWindowHeight() * colV;

  var col = hsv2Rgb(rate, colS, colVRate);
  this.col[0] += (col[0] - this.col[0]) * .1;
  this.col[1] += (col[1] - this.col[1]) * .1;
  this.col[2] += (col[2] - this.col[2]) * .1;

  var colR = parseInt(this.col[0]);
  var colG = parseInt(this.col[1]);
  var colB = parseInt(this.col[2]);

  ctx.save();

  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);

  ctx.fillStyle = `rgb( ${colR}, ${colG}, ${colB})`;
  ctx.beginPath();
  ctx.arc( 0, 0, this.rad, 0, 2 * Math.PI);
  ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-this.cross, 0);
    ctx.lineTo(this.cross, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -this.cross);
    ctx.lineTo(0, this.cross);
    ctx.stroke();


  ctx.restore();

};


Ball.prototype.getClosestPoints = function(rBody) {

  var contacts = [];

  if(this.isDisable){
    return contacts;
  }
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
