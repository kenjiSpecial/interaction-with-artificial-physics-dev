var Ball = require('./ball.js');
var Floor = require('./components/floor.js');
var Box = require('./components/box.js');
var AABB = require('./components/aabb.js');
var timeStep = 1/30;
var solver = require('./components/solver.js');

var Wiper = require('./wiper.js');
var WiperRectangle = require('./wiper-rectangle.js');

var Vector2 = require('ks-vector').Vector2;
var cw, ch;

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');

var App = function () {
    this.mObjects = [];
    this.isBackgroundAnimation = true;

    var wiper = new Wiper(this.mObjects);

    var wid = AppStore.getWindowWidth();
    var hig = AppStore.getWindowHeight();

    for (var ii = 0; ii < 60; ii++) {
        var xPos = wid * Math.random();
        var yPos = hig * Math.random() * -1;
        var velY = 250 + 50 * Math.random();
        var ball = new Ball(10, 30, new Vector2(xPos, yPos), new Vector2(0, velY));
        this.mObjects.push(ball);
    }

};

App.prototype.start = function () {

};

App.prototype.stop = function () {

}

App.prototype.update = function (ctx) {
    var dt = timeStep;

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

    var width = AppStore.getWindowWidth();
    var height = AppStore.getWindowHeight();
    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, width, height);


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


module.exports = App;
