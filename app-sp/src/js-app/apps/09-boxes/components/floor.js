var Vector2 = require('ks-vector').Vector2;
var Rectangle = require('./rectangle.js');
var AppStore = require('../../../../js/stores/app-store');

var Floor = function( x, y, wid, hig){
    Rectangle.call(this, 0, x, y, wid, hig);
    this.time = 0;
};

Floor.prototype = Object.create(Rectangle.prototype);
Floor.prototype.constructor = Floor;

Floor.prototype.loopMovement = function(dt) {
    this.time += dt;

    var winWid = AppStore.getWindowWidth();
    this.pos.x = winWid/2 + 300 * Math.sin(this.time/2);
}

Floor.prototype.loopRotation = function() {
    this.angle += .02;
}

module.exports = Floor;
