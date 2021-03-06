var NUM_ITERATIONS = 4;

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');

var Ball = require('./ball');

var frameImg = "/images/sp/frame.png";

//
var art1Img = "/images/sp/weave.png";
var art2Img = "/images/sp/pop-art.png";
var art3Img = "/images/sp/goch.png";
var art4Img = "/images/sp/pop2.png";
var art5Img = "/images/sp/pop3.png";

var artImgArr = [art5Img, art2Img, art3Img, art4Img, art1Img];

var baseImgWidth = 550;
var baseImgHeight = 400;
var frameWid = baseImgWidth / 2;
var frameHig = baseImgHeight / 2;
var wid = 425 / 2;
var hig = 585 / 4;
var left = (baseImgWidth / 2 - wid) / 2;
var top = (baseImgHeight / 2 - hig) / 2;

var halfLeft = left / 2 - 1;
var halfTop = top / 2;
var mouseRad = 30;

class ParticleManager {
    constructor() {
        this.MAX_NUM = 120;
        this.maxRad = 13;
        this.minRad = 5;
        this.balls = [];
        this.isTransit = false;

        for (var ii = 0; ii < this.MAX_NUM; ii++) {
            var ball = new Ball();
            this.balls.push(ball);
        }


        AppStore.on(CONSTANTS.LOAD_DONE, this.onLoadDoneHandler.bind(this));
    }

    start() {
        this.imageNum = 0;

        this.setLayout();

        var isCollided;
        for (var ii = 0; ii < this.balls.length; ii++) {
            var circle = this.balls[ii];
            circle.start();

            var minDis;
            isCollided = true;
            var count = 0;
            while (isCollided && count < 10) {
                isCollided = false;

                var randomX = Math.random() * (this.maxX - this.minX - this.minRad * 2) + this.minX + this.minRad;
                var randomY = Math.random() * (this.maxY - this.minY - this.minRad * 2) + this.minY + this.minRad;
                minDis = 9999;
                count++;

                for (var jj = 0; jj < ii; jj++) {
                    var otherCircle = this.balls[jj];
                    var otherX = otherCircle.position.x;
                    var otherY = otherCircle.position.y;
                    var otherRad = otherCircle.rad;
                    var dx = randomX - otherX;
                    var dy = randomY - otherY;

                    var dis = Math.sqrt(dx * dx + dy * dy);
                    minDis = Math.min(minDis, dis - otherRad);

                    if (minDis < this.minRad) {
                        isCollided = true;
                        break;
                    }
                }

                this.balls[ii].reset(randomX, randomY)
            }

            var disFromLeft = this.balls[ii].position.x - this.minX;
            var disFromRight = this.maxX - this.balls[ii].position.x;
            var disFromTop = this.balls[ii].position.y - this.minY;
            var disFromBottom = this.maxY - this.balls[ii].position.y;

            var rad = Math.max(Math.min(minDis, disFromLeft, disFromRight, disFromTop, disFromBottom, this.maxRad), this.minRad);
            this.balls[ii].rad = rad;
        }

    }

    onLoadDoneHandler() {
        var canvas = document.createElement("canvas");
        var canvasWidth = 107;
        var canvasHeight = 74;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        var ctx = canvas.getContext("2d");

        var allImages = AppStore.getImages();

        this.imageDataArr = [];

        for (var ii in artImgArr) {
            var img = allImages[artImgArr[ii]];
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            this.imageDataArr.push(imageData);
        }

        this.frameImg = allImages[frameImg];
        this.frameWid = this.frameImg.width;
        this.frameHig = this.frameImg.height;
    }

    stop() {

    }

    update() {
        var dt = 1 / 30;
        for (var ii = 0; ii < this.balls.length; ii++) {
            this.balls[ii].update(dt)
        }


        this.satisfyConstraints();
    }

    satisfyConstraints() {

        var mX = AppStore.get("touchX");
        var mY = AppStore.get("touchY");
        var isTouchOnCanvasApp = AppStore.get("isTouchOnCanvasApp");

        for (var xx = 0; xx < NUM_ITERATIONS; xx++) {
            for (var ii = 0; ii < this.balls.length; ii++) {
                var circle = this.balls[ii];
                var rad = circle.rad;


                for (var jj = 0; jj < ii; jj++) {
                    var circle2 = this.balls[jj];
                    var circleRadDis = circle.rad + circle2.rad;

                    var dx = circle.position.x - circle2.position.x;
                    var dy = circle.position.y - circle2.position.y;
                    var dis = Math.sqrt(dx * dx + dy * dy);

                    if (dis < circleRadDis) {
                        var diff = dis - circleRadDis;
                        var diffX = diff * dx / dis / 2;
                        var diffY = diff * dy / dis / 2;


                        circle.position.x -= diffX;
                        circle.position.y -= diffY;

                        circle2.position.x += diffX;
                        circle2.position.y += diffY;
                    }
                }

                if (isTouchOnCanvasApp) {
                    var mDx = circle.position.x - mX;
                    var mDy = circle.position.y - mY;

                    var mDis = Math.sqrt((mDx * mDx + mDy * mDy));
                    if (mDis < circle.rad + 20) {
                        var mDiff = circle.rad + 20 - mDis;
                        var mDiffX = mDiff * mDx / mDis;
                        var mDiffY = mDiff * mDy / mDis;

                        circle.position.x += mDiffX
                        circle.position.y += mDiffY;
                    }

                }


                circle.position.x = Math.min(Math.max(this.minX + rad, circle.position.x), this.maxX - rad);
                circle.position.y = Math.min(Math.max(this.minY + rad, circle.position.y), this.maxY - rad);

            }
        }


    }

    draw(ctx) {

        for (var ii in this.balls) {
            this.balls[ii].draw(ctx, this.imageDataArr[this.imageNum], this.minX, this.minY, wid, hig);
        }

        ctx.drawImage(this.frameImg, this.frameLeft, this.frameTop, frameWid, frameHig);


        if (this.isTransit) {
            ctx.save();

            ctx.drawImage(AppStore.getImages()[artImgArr[this.imageNum]], this.miniFrameLeft + halfLeft, this.miniFrameTop + halfTop);


            ctx.globalAlpha = this.alpha;
            ctx.drawImage(AppStore.getImages()[artImgArr[this.prevImageNum]], this.miniFrameLeft + halfLeft, this.miniFrameTop + halfTop);

            ctx.restore();
        } else {
            ctx.drawImage(AppStore.getImages()[artImgArr[this.imageNum]], this.miniFrameLeft + halfLeft, this.miniFrameTop + halfTop);
        }

        ctx.drawImage(this.frameImg, this.miniFrameLeft, this.miniFrameTop, frameWid / 2, frameHig / 2);
    }

    transitDrawing(ctx) {

    }

    changePainting() {
        if (this.isTransit) return;
        this.isTransit = true;

        this.prevImageNum = this.imageNum;
        this.imageNum = (this.imageNum + 1) % artImgArr.length;

        this.alpha = 1;
        TweenLite.to(this, .6, {alpha: 0, onComplete: this.onAlphaTweenComplete.bind(this)});
    }

    onAlphaTweenComplete() {
        this.isTransit = false;
    }

    onWindowResize() {
        this.setLayout();
    }

    setLayout() {

        if (window.orientation == 90 || window.orientation == -90) {
            this.frameLeft = (AppStore.getWindowWidth() - (frameWid + 20 + frameWid/2))/2;
            this.frameTop = (AppStore.getWindowHeight() - frameHig) / 2;

            this.miniFrameLeft = this.frameLeft + frameWid + 20;
            this.miniFrameTop = (AppStore.getWindowHeight() - frameHig/2)/2;


        } else {

            this.frameLeft = (AppStore.getWindowWidth() - frameWid) / 2;
            this.frameTop = (AppStore.getWindowHeight() - (frameHig + 20 + frameHig / 2) ) / 2;

            this.miniFrameLeft = (AppStore.getWindowWidth() - frameWid / 2) / 2;
            this.miniFrameTop = this.frameTop + frameHig + 20;

        }

        this.leftPos = left + this.frameLeft - 1.0
        this.topPos = top + this.frameTop;

        this.minX = this.leftPos;
        this.maxX = this.leftPos + wid;
        this.minY = this.topPos;
        this.maxY = this.topPos + hig;
    }

}

module.exports = ParticleManager;
