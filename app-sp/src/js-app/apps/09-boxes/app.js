var Floor = require('./components/floor');
var Box = require('./components/box');

var AABB = require('./components/aabb.js');
var solver = require('./components/solver.js');

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');

var colArr = ["#B71C1C", "#1B5E20", "#0D47A1"];

class App{
    constructor(){
        this.isBackgroundAnimation = true;

        this.mObjects = [];
        this.boxes = [];

        var winWid = AppStore.getWindowWidth();
        var winHig = AppStore.getWindowHeight();


        this.rotatingFloor = new Floor( winWid/2 - 20, 100, 40, 20 );
        this.mObjects.push(this.rotatingFloor);

        this.floor = new Floor( winWid/2 - 100, winHig - 100, 200, 50 );
        this.mObjects.push(this.floor);

        var floor3 = new Floor( winWid/2 -50, winHig/2-20, 100, 40);
        this.floor3 = floor3;
        this.mObjects.push(floor3);

        for(var ii = 0; ii < 15; ii++){
            var boxWid = 20 + parseInt(20 * Math.random());
            var boxHig = 20 + parseInt(20 * Math.random());
            var yPos = - 50 - boxHig;
            var xPos = window.innerWidth/2 - 50 + 100 * Math.random();
            var randomID = parseInt(3 * Math.random());
            var box = new Box( randomID, colArr[randomID], boxWid*boxHig, xPos, yPos, boxWid, boxHig);
            box.angle = Math.random() * Math.PI;

            this.mObjects.push(box)
            this.boxes.push(box)
        }

    }

    start(){
        this.onWindowResize();

        for(var ii in this.boxes){
            var box = this.boxes[ii];

            box.reset();
        }
    }

    stop(){

    }

    update(ctx){
        var dt = 1 / 30;
        var ii;

        this.rotatingFloor.loopRotation();
        this.floor.loopMovement(dt);

        this.generateMotionBounds(dt);

        this.contacts = this.collide();
        solver(this.contacts);

        for( ii in this.mObjects ){
            this.mObjects[ii].update(dt);
        }

        // --------------------------
        //           draw
        // --------------------------
        var winWid = AppStore.getWindowWidth();
        var winHig = AppStore.getWindowHeight();

        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, winWid, winHig);

        for( ii in this.mObjects){
            this.mObjects[ii].draw(ctx);
        }

        var side = 50;
        for( ii = 0; ii < colArr.length; ii++){
            var col = colArr[ii];

            var xPos = winWid/2 - 125 + 100 * ii;
            var yPos = 50;

            ctx.fillStyle = col;
            ctx.strokeStyle = "#000"
            ctx.fillRect(xPos, yPos, side, side);
            ctx.strokeRect(xPos, yPos, side, side);

            ctx.beginPath();
            ctx.moveTo(  xPos, yPos)
            ctx.lineTo(  xPos + side, yPos + side );
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(  xPos + side, yPos );
            ctx.lineTo(  xPos, yPos + side );
            ctx.stroke();
        }
    }

    generateMotionBounds(dt){
        for (var ii in this.mObjects) {
            this.mObjects[ii].generateMotionAABB(dt);
        }
    }

    collide(){
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

    onWindowResize(){
        var winWid = AppStore.getWindowWidth();
        var winHig = AppStore.getWindowHeight();

        this.rotatingFloor.resetPos(winWid/2-20, 150);
        this.floor.resetPos(winWid/2 - 200, winHig - 120)
        this.floor3.resetPos(winWid/2 -50, winHig/2 + 20);

    }

}


module.exports = App;
