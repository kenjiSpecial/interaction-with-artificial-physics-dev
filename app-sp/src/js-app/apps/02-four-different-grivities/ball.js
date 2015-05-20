var BaseBall = require("./components/ball");
var Vector2   = require('ks-vector').Vector2;

var AppStore = require('../../../js/stores/app-store');

var Ball = function(){
    var winWidth = AppStore.getWindowWidth();
    var winHeight = AppStore.getWindowHeight();

    var _mass = 0;
    var _rad = Math.min( winWidth, winHeight ) / 4 - 20;
    var _pos = new Vector2( winWidth/2, winHeight/2);
    var _vel = new Vector2(0, 0);

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

    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = "#0277BD"
    ctx.beginPath();
    ctx.arc( 0, 0, this.rad, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = "#4FC3F7";
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

Ball.prototype.resetAll = function() {
  var velY = 150 + 50 * Math.random();
  this.pos = new Vector2(window.innerWidth * Math.random(), -100 * Math.random() - this.rad );
  this.vel = new Vector2(0, velY);
  this.angularVel = -2*Math.PI + Math.random() * Math.PI;
};

Ball.prototype.onWindowResize = function() {
    var winWidth = AppStore.getWindowWidth();
    var winHeight = AppStore.getWindowHeight();

    this.rad = Math.min( winWidth, winHeight ) / 4 - 20;
    this.pos.set( winWidth/2, winHeight/2 );

    this.br = this.rad;
}



module.exports = Ball;
