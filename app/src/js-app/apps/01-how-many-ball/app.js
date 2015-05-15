var TweenLite = require('gsap');
var AABB = require('./components/aabb');
//var CONSTANTS = require('./components/constants');
var timeStep = 1 / 30;
var solver = require('./components/solver');

var Box = require('./box');
var Ball = require('./components/ball');
var Plane = require('./components/plane');

var Vector2 = require('ks-vector').Vector2;

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');
var canvasApp = require('../../../js/components/js/canvas-app');

var cw, ch;
var scale = 1;
var count = 1;
var width;

var App = function () {
    this.isBackgroundAnimation = true;
    this.loop = this.loop.bind(this);

};

App.prototype.start = function () {
    width = AppStore.getWindowWidth();

    this.mObjects = null;
    this.mObjects = [];

    var box = new Box(1, 0, 300, 100, 100);
    this.mObjects.push(box);

    this.ballArr = null;
    this.ballArr = [];

    var rad = 30;
    var ball = new Ball(10, 30, new Vector2(100, -rad), new Vector2(0, 0));
    ball.num = this.ballArr.length;

    this.scale = 1;

    var plane = new Plane(width / 4, AppStore.getWindowHeight() + 1, width/2);
    this.mObjects.push(plane);

    this.curTimer = setTimeout(this.loop, 1000);
};


App.prototype.loop = function () {
    var rad = parseInt(10 + Math.random() * 40);
    var ball = new Ball(10, rad, new Vector2(100, -rad), new Vector2(0, 0));
    ball.num = this.ballArr.length;
    this.ballArr.push(ball);
    this.mObjects.push(ball);


    this.curTimer = setTimeout(this.loop, 1000);
};

App.prototype.stop = function () {
    clearTimeout(this.curTimer);
};

App.prototype.update = function (ctx) {
    var dt = timeStep;
    // ---------------
    this.generateMotionBounds(dt);
    // ---------------

    this.contacts = this.collide();
    solver(this.contacts);

    for (var ii in this.mObjects) {
        if (this.mObjects[ii]) this.mObjects[ii].update(dt);
    }


    var posArr = [];
    for (var ii = 0; ii < count; ii++) {
        posArr[ii] = 0;
    }

    for (var ii in this.ballArr) {
        var ball = this.ballArr[ii];
        if (ball) {
            var pos = parseInt(ball.pos.y / window.innerHeight);
            if (pos < 0) pos = 0;
            posArr[pos] = posArr[pos] + 1;
        }
    }

    // -------------------------
    //  draw
    // -------------------------
    ctx.save();
    ctx.scale(this.scale, this.scale)

    ctx.fillStyle = "#ffeb3b";
    ctx.fillRect(0, 0, window.innerWidth / this.scale, window.innerHeight / this.scale);


    for (var ii in this.mObjects) {
        if (this.mObjects[ii]) this.mObjects[ii].draw(ctx);
    }

    ctx.textAlign = "end";

    ctx.font = `700 ${AppStore.getWindowHeight()}px "Roboto"`;
    ctx.fillStyle = "#000";

    for (var ii = 0; ii < posArr.length; ii++) {
        ctx.fillText(posArr[ii], window.innerWidth / this.scale, window.innerHeight * (ii + 1));
    }


    ctx.restore();

    var ballPosY = 0;
    for (var ii = 0; ii < this.ballArr.length; ii++) {
        var ball = this.ballArr[ii];
        if (ball) {
            ballPosY = Math.max(ballPosY, ball.pos.y);
            var posX = ball.pos.x;
            var rad = ball.rad;
            if (posX < -ball.rad || posX > window.innerWidth * count + rad) {
                var num = ball.num;
                this.ballArr[num] = null;
            }


        }
    }
    if (count > 3) {


    } else {

        if (ballPosY > AppStore.getWindowHeight() * count) this.scaleDown();
    }


};


App.prototype.scaleDown = function () {

    count++;
    TweenLite.to(this, 2, {scale: 1 / count, ease: Expo.easeOut});
    var windHig = AppStore.getWindowHeight();
    var width = AppStore.getWindowWidth() / 2;

    var box = new Box(1, width * (count - 1 ) + 100, 100 + windHig * (count - 1), 100, 100);
    this.mObjects.push(box);

    var box = new Box(1, width * (count - 1 + 1 ) - 100, windHig * (count - 1 + 1) - 350, 100, 100);
    this.mObjects.push(box);

    var plane = new Plane(width / 2 * count, windHig * count, width * count);
    this.mObjects.push(plane);

};

App.prototype.generateMotionBounds = function (dt) {
    for (var ii in this.mObjects) {
        if (this.mObjects[ii]) this.mObjects[ii].generateMotionAABB(dt);
    }
};

App.prototype.collide = function () {
    var contacts = [];

    for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
        var rigidBodyA = this.mObjects[ii];
        for (var jj = ii + 1; jj < this.mObjects.length; jj++) {
            var rigidBodyB = this.mObjects[jj];

            if (rigidBodyA && rigidBodyB) {
                if (rigidBodyA.mass != 0 || rigidBodyB.mass != 0) {
                    if (AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)) {
                        var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
                        contacts = contacts.concat(_contacts);
                    }
                }
            }
        }
    }

    return contacts;
};

module.exports = App;
