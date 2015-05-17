var Floor = require('./components/floor.js');
var Plane = require('./components/plane');
var Box = require('./components/box.js');
var Ball = require('./components/ball');

var AABB = require('./components/aabb.js');

var Vector2 = require('ks-vector').Vector2;
var solver = require('./components/solver.js');
var TweenLite = require('gsap');;
var cw, ch;

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');


var App = function () {
    this.onRemovedHandler = this.onRemovedHandler.bind(this);
    this.isBackgroundAnimation = false;
    this.loop = this.loop.bind(this);
};

App.prototype.start = function() {

    var windowWid = AppStore.getWindowWidth();
    var windowHig = AppStore.getWindowHeight();

    this.mObjects = null;
    this.mObjects = [];
    this.planes = null;
    this.planes = [];

    var plane0 = new Plane(windowWid / 2, windowHig, windowWid);
    this.mObjects.push(plane0)
    this.planes.push(plane0)

    var plane1 = new Plane(0, windowHig / 2, windowHig);
    plane1.angle = Math.PI / 2;
    this.mObjects.push(plane1);

    var plane2 = new Plane(windowWid, windowHig / 2, windowHig);
    plane2.angle = Math.PI / 2;
    this.mObjects.push(plane2);

    this.balls = null;
    this.balls = [];

    this.count = 0;
    this.loop();
}

App.prototype.stop = function() {
    clearTimeout(this.timerID);
    for(var ii in this.balls){
        this.balls[ii].stop();
        this.balls[ii].removeListener("removed", this.onRemovedHandler);
    }
}

App.prototype.loop = function () {
    this.add();

    this.count++;

    if(this.count > 40) return;
    this.timerID = setTimeout(this.loop, 300);

};

App.prototype.onTweenComplete = function(val){
    this.mObjects.splice(3, 1);
    this.balls.shift();

    this.add();
};

App.prototype.add = function(){
    var rad = 30 + parseInt(50 * Math.random());
    var isCollide;
    var count = 0;
    while( !isCollide || count < 3){
        var yPos = -800 * Math.random() - rad;
        var xPos = Math.random() * (AppStore.getWindowWidth() - rad * 2) + rad;
        isCollide = true;
        count++;

        for(var ballNum in this.balls){
            var ballPos = this.balls[ballNum].pos;
            var ballRad = this.balls[ballNum].rad;
            var dx = ballPos.x - xPos;
            var dy = ballPos.y - yPos;
            var dis = Math.sqrt( dx * dx + dy * dy);

            if(ballRad + rad > dis) isCollide = false;
        }

    }

    var ballLength = this.balls.length;
    var velY = 100;
    var ball = new Ball(rad, rad, new Vector2(xPos, -rad), new Vector2(0, velY), ballLength);
    ball.addListener("removed", this.onRemovedHandler);
    ball.start();

    this.mObjects.push(ball);
    this.balls.push(ball);

    //TweenLite.to(this.balls[0], .6, {br: 0, delay: 2, ease: Expo.easeOut, onComplete: this.onTweenComplete.bind(this, this.count)});
};

App.prototype.onRemovedHandler = function(num) {
    var rad = 30 + parseInt(50 * Math.random());
    var isCollide;
    var xPos, yPos;
    var count = 0;
    while( !isCollide || count < 3 ){
        yPos = -200 * Math.random() - rad;
        xPos = Math.random() * (AppStore.getWindowWidth() - rad * 2) + rad;
        isCollide = true;
        count++;

        for(var ballNum in this.balls){
            var ballPos = this.balls[ballNum].pos;
            var ballRad = this.balls[ballNum].rad;
            var dx = ballPos.x - xPos;
            var dy = ballPos.y - yPos;
            var dis = Math.sqrt( dx * dx + dy * dy);

            if(ballRad + rad > dis) isCollide = false;
        }

    }


    //console.log(`${rad}, ${xPos}, ${yPos}`);
    this.balls[num].reset( rad, xPos, yPos );
    this.balls[num].start();
};


App.prototype.update = function (ctx) {
    var dt = 1/30;

    // ---------------
    this.generateMotionBounds(dt);
    // ---------------

    this.contacts = this.collide();
    solver(this.contacts);


    for (var ii in this.mObjects) {
        this.mObjects[ii].update(dt);
    }

    // -------------------------
    //  draw
    // -------------------------

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, AppStore.getWindowWidth(), AppStore.getWindowHeight());

    for (var ii in this.mObjects) {
        this.mObjects[ii].draw(ctx);
    }

};

App.prototype.generateMotionBounds = function (dt) {
    for (var ii in this.mObjects) {
        this.mObjects[ii].generateMotionAABB(dt);
    }
};

App.prototype.collide = function () {
    var contacts = [];

    for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
        var rigidBodyA = this.mObjects[ii];
        for (var jj = ii + 1; jj < this.mObjects.length; jj++) {
            var rigidBodyB = this.mObjects[jj];

            if (rigidBodyA.mass != 0 || rigidBodyB.mass != 0) {
                if (AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)) {
                    var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
                    contacts = contacts.concat(_contacts);
                }
            }
        }
    }

    return contacts;
}

App.prototype.reset = function() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

module.exports = App;
