var Vector2 = require('ks-vector').Vector2;
var Rectangle = require('./rectangle.js');
var AppStore = require('../../../../js/stores/app-store');

var Box = function (id, col, mass, x, y, wid, hig) {
    Rectangle.call(this, mass, x, y, wid, hig);
    this.id = id;
    this.col = col;

    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;

    this.largeSide = Math.min( wid, hig );
};

Box.prototype = Object.create(Rectangle.prototype);
Box.prototype.constructor = Box;

Box.prototype.update = function (dt) {
    Rectangle.prototype.setGravity.call(this);

    this.vel.x += this.force.x * this.invMass;
    this.vel.y += this.force.y * this.invMass;

    Rectangle.prototype.update.call(this, dt);
};

Box.prototype.draw = function (ctx) {

    ctx.save();

    ctx.fillStyle = this.col;
    ctx.strokeStyle = "#000000";

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);


    ctx.beginPath();
    ctx.fillRect(-this.halfWidth, -this.halfHeight, this.width, this.height);
    ctx.strokeRect(-this.halfWidth, -this.halfHeight, this.width, this.height);


    ctx.beginPath();
    ctx.moveTo( -this.halfWidth, -this.halfHeight)
    ctx.lineTo(  this.halfWidth,  this.halfHeight );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(  this.halfWidth, -this.halfHeight );
    ctx.lineTo( -this.halfWidth,  this.halfHeight );
    ctx.stroke();

    ctx.restore();

    var winWid = AppStore.getWindowWidth();
    var winHig = AppStore.getWindowHeight();
    if(this.pos.x < -this.width || this.pos.x > winWid + this.largeSide || this.pos.y > winHig + this.largeSide){
        this.reset();
    }

};

Box.prototype.reset = function() {
    var winWid = AppStore.getWindowWidth();
    var xPos, yPos;

    this.vel.set(0, 0);

    this.angle = Math.PI * Math.random();
    this.angularVel = 0;

    switch(this.id){
        case 0:
            xPos = winWid /2 - 100;
            break;
        case 1:
            xPos = winWid/2 ;
            break;
        case 2:
            xPos = winWid/2 + 100;
            break;
    }
    yPos = 75;

    this.pos.set(xPos, yPos)
};

module.exports = Box;
