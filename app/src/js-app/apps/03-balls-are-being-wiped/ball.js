var BaseBall = require("./components/ball");
var Vector2   = require('ks-vector').Vector2;

var Ball = function(_mass, _rad, _pos, _vel){
    BaseBall.call(this, _mass, _rad, _pos, _vel );

    this.br = _rad;
    this.angularVel = -2*Math.PI + Math.random() * Math.PI;
};

Ball.prototype = Object.create(BaseBall.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function(dt){
  this.vel.x += this.force.x * this.invMass;
  this.vel.y += this.force.y * this.invMass;

  this.angle += this.angularVel * dt;

  // ====================

  this.pos.x += this.vel.x * dt;
  this.pos.y += this.vel.y * dt;

  this.force.x = 0;
  this.force.y = 0;
};

Ball.prototype.draw = function(ctx) {
  BaseBall.prototype.draw.call(this, ctx);

  if(this.pos.x < -this.rad || this.pos.x > window.innerWidth + this.rad || this.pos.y > window.innerHeight + this.rad){
     this.resetAll();
     return;
   }

   if(this.pos.y < -this.rad && this.vel.y < 0){
     var velY = 150 + 50 * Math.random();
     this.vel = new Vector2(0, velY);
   }
};

Ball.prototype.resetAll = function() {
  var velY = 150 + 50 * Math.random();
  this.pos = new Vector2(window.innerWidth * Math.random(), -100 * Math.random() - this.rad );
  this.vel = new Vector2(0, velY);
  this.angularVel = -2*Math.PI + Math.random() * Math.PI;
};



module.exports = Ball;
