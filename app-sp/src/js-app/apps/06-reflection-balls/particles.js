var NUM_ITERATIONS = 2;
var Ball = require('./ball');

var AppStore = require('../../../js/stores/app-store');
var gsap = require('gsap');

var colArr = ["#3F51B5", "#E91E63"];

class Particles {
    constructor(num) {
        this.num = num || 100;

        this.circles = [];

        var rad, xPos, yPos;
        for (var ii = 0; ii < this.num; ii++) {
            rad = parseInt(10 + 10 * Math.random());
            xPos = (.1 + .8 * Math.random()) * AppStore.getWindowWidth();
            yPos = (.1 + .8 * Math.random()) * AppStore.getWindowHeight();

            var circle = new Ball(xPos, yPos, rad);
            this.circles.push(circle);
        }


    }

    changeReflection() {
        this.reflectNumber *= -1;
    }

    update(dt) {

        for (var ii = 0; ii < this.num; ii++) {
            this.circles[ii].update(dt)
        }

        this.satisfyConstraints();
    }

    start() {
        this.colNum = 0;
        this.col = colArr[this.colNum];
        this.reflectNumber = -1;
    }

    changeNumber() {
        this.reflectNumber *= -1;
    }

    stop() {

    }

    satisfyConstraints() {
        var winWid = window.innerWidth;
        var winHig = window.innerHeight;

        var mX = AppStore.get("touchX");
        var mY = AppStore.get("touchY");
        var isTouchOnCanvasApp = AppStore.get("isTouchOnCanvasApp");

        for (var xx = 0; xx < NUM_ITERATIONS; xx++) {
            for (var ii = 0; ii < this.num; ii++) {
                var circle = this.circles[ii];
                var rad = circle.rad;
                circle.position.x = Math.min(Math.max(rad, circle.position.x), winWid - rad);
                circle.position.y = Math.min(Math.max(rad, circle.position.y), winHig - rad);

                for (var jj = 0; jj < ii; jj++) {
                    var circle2 = this.circles[jj];
                    var circleRadDis = circle.rad + circle2.rad;

                    var dx = circle.position.x - circle2.position.x;
                    var dy = circle.position.y - circle2.position.y;
                    var dis = Math.sqrt(dx * dx + dy * dy);

                    if (dis < circleRadDis) {
                        var diff = (circleRadDis - dis) * this.reflectNumber;
                        var diffX = diff * dx / dis / 2;
                        var diffY = diff * dy / dis / 2;


                        circle.position.x -= diffX;
                        circle.position.y -= diffY;

                        circle2.position.x += diffX;
                        circle2.position.y += diffY;
                    }

                    if (isTouchOnCanvasApp) {
                        var mDx = circle.position.x - mX;
                        var mDy = circle.position.y - mY;

                        var mDis = Math.sqrt((mDx * mDx + mDy * mDy));

                        if (mDis < circle.rad + 40) {
                            var mDiff = circle.rad + 40 - mDis;
                            var mDiffX = mDiff * mDx / mDis;
                            var mDiffY = mDiff * mDy / mDis;

                            circle.position.x -= mDiffX * this.reflectNumber;
                            circle.position.y -= mDiffY * this.reflectNumber;
                        }


                    }

                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.col;
        ctx.fillRect(0, 0, AppStore.getWindowWidth(), AppStore.getWindowHeight());
        for (var ii = 0; ii < this.num; ii++) {
            this.circles[ii].draw(ctx);
        }
    }

}

module.exports = Particles;
