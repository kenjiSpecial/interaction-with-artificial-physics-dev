var Vector2 = require('ks-vector').Vector2;
var AABB = require('./aabb.js');
var Ball;
var Rectangle = require('./rectangle.js');
var Contact   = require('./contact.js');
var utils     = require('./utils.js');

var AppStore = require('../../../../js/stores/app-store');

var TweenLite = require('gsap');

var Plane = function( x, y, width, col ) {
  Ball = require('./ball.js');
  Rectangle = require('./rectangle.js');

  this.vel = new Vector2();
  this.angularVel = 0;
  this.angle = 0;
  this.color = col;

  this.pos = new Vector2( x, y );

  this.drawY = y - 1;
  this.origDrawY = this.drawY;

  this.halfMinusExtent = new Vector2( -width/2, 0);
  this.halfPluseExtent = new Vector2( width/2, 0);

  this.invMass = 0;
  this.invI = 0;

  this.isDisable = false;
  this.isDisableTrans = false;

  //this.angle = Math.PI/10;

};

Plane.prototype.onWindowResize = function( xx, yy, width) {
    this.pos.set( xx, yy);

    this.halfMinusExtent.x = -width/2;
    this.halfPluseExtent.x = width/2;
    this.drawY = yy - 1;
    this.origDrawY = this.drawY;
}

Plane.prototype.update = function(dt) {

  // body...
}

Plane.prototype.setDiable = function() {
  if(this.isDisableTrans) return;
  this.isDisableTrans = true;
  this.isDisable = true;

  this.drawY = this.origDrawY;
  var targetY = this.drawY - AppStore.getWindowHeight();
  this.paintHeight = 0;

  TweenLite.to(this, .4, {drawY : targetY, paintHeight: AppStore.getWindowHeight(), ease: Power2.easeInOut});
  TweenLite.to(this, .4, {paintHeight: 0, delay: .4, ease: Power2.easeOut, onComplete: this.onTweenAnimationCompleteHandler.bind(this)});
} ;

Plane.prototype.onTweenAnimationCompleteHandler = function() {
    this.isDisableTrans = false;
    this.isDisable = false;
}

Plane.prototype.setTimerHandler = function() {
  this.isDisableTrans = false;
  this.isDisable = false;
}

Plane.prototype.draw = function(ctx) {
  if(this.isDisable){
    ctx.fillStyle = this.color;
    ctx.fillRect(0, this.drawY, AppStore.getWindowWidth() * 4, this.paintHeight);
  }

};

Plane.prototype.getNormal = function() {
  return new Vector2(-Math.sin(this.angle), Math.cos(this.angle));
};

/**
*  @param {Vector2} pt
*
*  @param {Object}
*/
Plane.prototype.getDistance = function(pt) {

  var delta = pt.copy().subtract(this.pos);
  var rotatedVector = delta.rotate(-this.angle);

  var dClamed = rotatedVector.clamp(this.halfMinusExtent, this.halfPluseExtent);
  var clamped = dClamed.rotate(this.angle);

  var clampedP = this.pos.copy().add(clamped);
  var d = new Vector2(pt.x - clampedP.x, pt.y - clampedP.y);
  var dNormal = d.getNormal();

  var dist = d.dotProduct(dNormal);

  return {dist : dist, normal : dNormal, clampedP: clampedP};
}


/**
* @param {RigidBody} rBody
*/
Plane.prototype.getClosestPoints = function(rBody) {
  var contacts = [];
  if(this.isDisable){ return contacts; }

  if(rBody instanceof Ball){
    var ballB = rBody;

    var delta = ballB.pos.copy().subtract(this.pos);
    var rotatedVector = delta.rotate(-this.angle);

    var dClamed = rotatedVector.clamp(this.halfMinusExtent, this.halfPluseExtent);
    var clamped = dClamed.rotate(this.angle);

    var clampedP = this.pos.copy().add(clamped);
    var d = new Vector2(ballB.pos.x - clampedP.x, ballB.pos.y - clampedP.y);
    var dist = d.getLength() - ballB.rad;
    var n = d.getNormal();

    var pa = clampedP;
    var pb = ballB.pos.copy().subtractMultipledVector(ballB.rad, n);

    var k = 1;

    contacts.push(new Contact(this, ballB, pa, pb, n, dist, k))

  }else if(rBody instanceof Rectangle){
    var rectangleB = rBody;
    contacts = rectangleB.getClosestPoints(this);

    utils.flipContacts(contacts);

  }else if(rBody instanceof Plane){

  }else{
    console.error('Plane getClosestPoints error');
  }

  return contacts;

}

/**
* @param {Number} dt
*/
Plane.prototype.generateMotionAABB = function(dt) {

  var boundsAll = AABB.buildAABBPlanes(this, dt);
  var boundsNow = boundsAll.now;
  var boundsNextFrame = boundsAll.next;

  this.motionBounds = new AABB();
  this.motionBounds.setAABB( boundsNow, boundsNextFrame );

}



module.exports = Plane;
