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

var cw, ch;
var scale = 1;
var count = 1;
var width;
var loopDuration = 600;
var colors = ['#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#F57F17'];


var App = function () {
    this.isBackgroundAnimation = true;
    this.loop = this.loop.bind(this);

};

App.prototype.start = function () {
    count = 1;
    width = AppStore.getWindowWidth();

    this.mObjects = null;
    this.mObjects = [];



    this.ballArr = null;
    this.ballArr = [];

    this.planeArr = [];

    this.scale = 1;

    for(var ii = 0; ii < 4; ii++){
        var plane = new Plane(width * 2, AppStore.getWindowHeight() * (ii+1), width * 4, colors[ii+1]);
        this.planeArr.push(plane);
        this.mObjects.push(plane);
    }

    var box = new Box(1, 0, 300, 100, 100);
    this.mObjects.push(box);

    this.curTimer = setTimeout(this.loop, loopDuration );
};


App.prototype.loop = function () {

    var rad = parseInt(30 + Math.random() * 70);
    var ball = new Ball(10, rad, new Vector2(100, -rad), new Vector2(0, 0));
    ball.num = this.ballArr.length;
    this.ballArr.push(ball);
    this.mObjects.push(ball);


    this.curTimer = setTimeout(this.loop, loopDuration );
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

    var winWid = AppStore.getWindowWidth();
    var winHig = AppStore.getWindowHeight();


    var posArr = [];
    for (var ii = 0; ii < count; ii++) {
        posArr[ii] = 0;
    }

    for (var ii in this.ballArr) {
        var ball = this.ballArr[ii];
        if (ball) {
            var pos = parseInt(ball.pos.y / winHig);
            if (pos < 0) pos = 0;
            posArr[pos] = posArr[pos] + 1;
        }
    }

    for(var ii in posArr){
        var posNumber = posArr[ii];
        var cirNum = 3 * ( parseInt(ii) + 1);
        if(posNumber >= cirNum) this.planeArr[ii].setDiable();
    }


    // -------------------------
    //  draw
    // -------------------------

    var curWinWid = winWid / this.scale;

    ctx.save();
    ctx.scale(this.scale, this.scale)

    var countScale = 1/this.scale;

    for(var ii = 0; ii < countScale; ii++){
        ctx.fillStyle = colors[ii];

        ctx.fillRect(0, ii * winHig, curWinWid, winHig);
    }


    for (var ii in this.mObjects) {
        if (this.mObjects[ii]) this.mObjects[ii].draw(ctx);
    }

    ctx.textAlign = "end";

    ctx.font = `700 ${winHig}px "Roboto"`;
    ctx.fillStyle = "#000";

    for (var ii = 0; ii < posArr.length; ii++) {
        ctx.fillText(posArr[ii], curWinWid, winHig * (ii + 1));
    }


    ctx.restore();

    var ballPosY = 0;
    for (var ii = 0; ii < this.ballArr.length; ii++) {
        var ball = this.ballArr[ii];
        if (ball) {
            ballPosY = Math.max(ballPosY, ball.pos.y);
            var posX = ball.pos.x;
            var rad = ball.rad;
            if (posX < -ball.rad || posX > winWid * count + rad) {
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
    var width = AppStore.getWindowWidth();


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

App.prototype.onWindowResize = function() {
    var width = AppStore.getWindowWidth();
    var height = AppStore.getWindowHeight();

    for(var ii = 0; ii < 4; ii++){
        this.planeArr[ii].onWindowResize( width * 2, height * (ii + 1), width*4 );
    }

}

module.exports = App;
