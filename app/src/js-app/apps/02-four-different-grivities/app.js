
var Ball      = require('./moving-ball.js');

var OutlineBall = require('./ball.js');
var Floor     = require('./components/floor.js');
var Box       = require('./components/box.js');
var AABB      = require('./components/aabb.js');
var solver    = require('./components/solver.js');
var timeStep = 1 / 30;
var Vector2   = require('ks-vector').Vector2;
var cw, ch;
var col = "#29B6F6";

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');
var canvasApp = require('../../../js/components/js/canvas-app');

var App = function() {
    this.isBackgroundAnimation = true;

    this.mObjects = [];

    for(var ii = 0; ii < 15; ii++){
        var ball = new Ball();
        this.mObjects.push(ball);
    }


    var ball = new OutlineBall();
    this.mObjects.push(ball);
    this.count = 0;

};

App.prototype.start = function() {

};

App.prototype.stop = function() {

};

App.prototype.update = function(ctx) {
    var dt = timeStep;
    var ii;

    // ---------------
    this.generateMotionBounds(dt);
    // ---------------

    this.contacts = this.collide();
    solver(this.contacts);


    for( ii in this.mObjects){
        this.mObjects[ii].update(dt);
    }

    // -------------------------
    //  draw
    // -------------------------
    var winWid = AppStore.getWindowWidth();
    var winHig = AppStore.getWindowHeight();


    ctx.fillStyle = col;
    ctx.fillRect(0, 0, winWid, winHig);

    for( ii in this.mObjects){
        this.mObjects[ii].draw(ctx);
    }

};

App.prototype.generateMotionBounds = function(dt) {
    for(var ii in this.mObjects){
        this.mObjects[ii].generateMotionAABB(dt);
    }
};

App.prototype.collide = function() {
    var contacts = [];

    for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
        var rigidBodyA = this.mObjects[ii];
        for(var jj = ii + 1; jj < this.mObjects.length; jj++){
            var rigidBodyB = this.mObjects[jj];

            if( rigidBodyA.mass != 0 || rigidBodyB.mass != 0 ){
                if(AABB.overlap(rigidBodyA.motionBounds, rigidBodyB.motionBounds)){
                    var _contacts = rigidBodyA.getClosestPoints(rigidBodyB);
                    contacts = contacts.concat(_contacts);
                }
            }
        }
    }

    return contacts;
}

module.exports = App;
