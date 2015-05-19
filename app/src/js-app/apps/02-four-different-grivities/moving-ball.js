var BaseBall = require("./components/ball");
var CONSTANTS = require('./components/constants.js');
var Vector2 = require('ks-vector').Vector2;
var AppStore = require('../../../js/stores/app-store');

var Ball = function() {
    var mass = 10;
    var rad = 20 + parseInt(30 * Math.random());
    var xPos, yPos;

    var winWidth = AppStore.getWindowWidth();
    var winHeight = AppStore.getWindowHeight();

    if (Math.random() < .25) {
        this.id = 0;
        xPos = winWidth / 2 - 100 + 200 * Math.random();
        yPos = -200 * Math.random() - rad;

        this.gravityX = 0;
        this.gravityY = 1;
    } else if (Math.random() < .5) {
        this.id = 1;
        xPos = winWidth / 2 - 100 + 200 * Math.random();
        yPos = 200 * Math.random() + winHeight + rad;

        this.gravityX = 0;
        this.gravityY = -1;
    } else if (Math.random() < .75) {
        this.id = 2;
        xPos = -100 * Math.random() - rad;
        yPos = winHeight / 2 - 100 + 200 * Math.random();

        this.gravityX = 1;
        this.gravityY = 0;
    } else {
        this.id = 3;
        xPos = winWidth + 100 * Math.random() + rad;
        yPos = winHeight / 2 - 100 + 200 * Math.random();

        this.gravityX = -1;
        this.gravityY = 0;
    }


    BaseBall.call(this, mass, rad, new Vector2(xPos, yPos), new Vector2(0, 0));

}


Ball.prototype = Object.create(BaseBall.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function(dt) {

    this.force.y += this.gravityY * this.mass;
    this.force.x += this.gravityX * this.mass;

    this.vel.x += this.force.x * this.invMass;
    this.vel.y += this.force.y * this.invMass;

    this.vel.x += this.force.x * this.invMass;
    this.vel.y += this.force.y * this.invMass;

    this.angle += this.angularVel * dt;

    // ====================

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    this.force.x = 0;
    this.force.y = 0;

}

Ball.prototype.draw = function(ctx) {
    BaseBall.prototype.draw.call(this, ctx);

    var winWidth = AppStore.getWindowWidth();
    var winHeight = AppStore.getWindowHeight();

    if (this.id == 0) {
        if (this.pos.x < -this.rad || this.pos.x > winWidth + this.rad || this.pos.y > winHeight + this.rad) {
            this.reset1();
            return;
        }
    } else if (this.id == 1) {
        if (this.pos.x < -this.rad || this.pos.x > winWidth + this.rad || this.pos.y < -this.rad) {
            this.reset2();
            return;
        }
    } else if (this.id == 2) {
        if (this.pos.x > winWidth + this.rad || this.pos.y < -this.rad || this.pos.y > winHeight + this.rad) {
            this.reset3();
            return;
        }

    } else if (this.id == 3) {
        if (this.pos.x < -this.rad || this.pos.y < -this.rad || this.pos.y > winHeight + this.rad) {
            this.reset4();
            return;
        }
    }

}




Ball.prototype.reset1 = function() {
    this.pos = new Vector2(AppStore.getWindowWidth() / 2 - 100 + 200 * Math.random(), -100 * Math.random() - this.rad);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};

Ball.prototype.reset2 = function() {
    this.pos = new Vector2(AppStore.getWindowWidth() / 2 - 100 + 200 * Math.random(), AppStore.getWindowHeight() + 100 * Math.random() + this.rad);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};

Ball.prototype.reset3 = function() {
    var xPos, yPos;
    xPos = -100 * Math.random() - this.rad;
    yPos = AppStore.getWindowHeight() / 2 - 100 + 200 * Math.random();
    this.pos = new Vector2(xPos, yPos);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};

Ball.prototype.reset4 = function() {
    var xPos, yPos;
    xPos = AppStore.getWindowWidth() + 100 * Math.random() + this.rad;
    yPos = AppStore.getWindowHeight() / 2 - 100 + 200 * Math.random();

    this.pos = new Vector2(xPos, yPos);
    this.vel = new Vector2(0, 0);
    this.angularVel = 0;
};




module.exports = Ball;
