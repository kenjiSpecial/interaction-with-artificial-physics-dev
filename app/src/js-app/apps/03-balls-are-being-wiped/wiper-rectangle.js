var Rectangle = require('./components/rectangle');
var Vector2 = require('ks-vector').Vector2;
var CONSTANTS = require('./components/constants.js');
var TweenLite = require('gsap');;
var AppStore = require('../../../js/stores/app-store');

var vel1 = Math.PI/3;
var vel2 = Math.PI;

var WiperRectangle = function( x, y, width, height ){
    Rectangle.call(this, 0, x, y, width, height);


    this.setAnchor( 10/width, .5);
    this.angularVel = -vel1;
};

WiperRectangle.prototype = Object.create(Rectangle.prototype);
WiperRectangle.prototype.constructor = WiperRectangle;

WiperRectangle.prototype.update = function(dt){
  if(this.isBig){
    this.angle += this.angularVel * dt;
    if(this.angle > 0) this.angularVel = -vel1;
    if(this.angle < -Math.PI ) this.angularVel = vel1;
  }else{
    //Rectangle.prototype.update.call(this, dt);

    //this.pos
    this.pos.x = this.anchor.x * this.width + this.originalX + (this.parentRectangle.width - 20) * Math.cos(this.parentRectangle.angle);
    this.pos.y = this.anchor.y * this.height + this.originalY + (this.parentRectangle.width-20) * Math.sin(this.parentRectangle.angle);

    this.angle += vel2 * dt;
  }
}



module.exports = WiperRectangle;
