var Vec2 = require('ks-vector').Vector2;
var TIME_STEP = require('./constants.js').TIME_STEP;

var colArr = ["244, 67, 54", "63, 81, 181", "76, 175, 80",  "0, 0, 0"];

var Ball = require('./ball');
var AppStore = require('../../../../js/stores/app-store');

class Verlet {
    /**
     * @param {Number} width
     * @param {NUmber} height
     * @param {2dContext} ctx
     */

    constructor(width, height) {
        this.reset = this.reset.bind(this);
        this.width = width;
        this.height = height;

        this.gravity = new Vec2(0, 200);
        this.friction = .99;
        this.groundFriction = 0.8;

        this.bounds = function (particle) {
            if (particle.pos.y > this.height - 1)
                particle.pos.y = this.height - 1;

            if (particle.pos.x < 0)
                particle.pos.x = 0;

            if (particle.pos.x > this.width - 1)
                particle.pos.x = this.width - 1;
        };

        this.composites = [];
        this.alphaArr = [];

        this.MAX_TYPE = 5;
        this.type = this.MAX_TYPE - 1;

        var windowWid = AppStore.getWindowWidth();
        var windowHig = AppStore.getWindowHeight();

        this.ballCase0Theta = 0;
        this.ballsCase0 = [
            new Ball( windowWid / 2, 50, 50),
            new Ball( windowWid / 2 - 300, windowHig / 2, 100),
            new Ball( windowWid / 2 + 300, windowHig / 2, 100)
        ]

        // ---------------------

        this.ballsCase1 = [];
        this.ballCase2Rad = Math.min( windowWid, windowHig ) * .3;
        this.ballCase2Theta = 0;

        for(var ii = 0; ii < 20; ii++){
            var theta = ii / 10 * Math.PI;
            var xPos = windowWid/2 + this.ballCase2Rad * Math.cos(theta);
            var yPos = windowHig/2 + this.ballCase2Rad * Math.sin(theta);
            var ball = new Ball( xPos,  yPos, 30);
            this.ballsCase1.push(ball);
        }

        // ---------------------
        this.ballsCase2 = [];
        this.ballsCase2VelTheta = [];
        this.ballsCase2Theta = [];

        var startPos = 0;
        var count = 1;
        while(startPos < windowHig - 100){
            var xPos = windowWid / 2;
            var yPos = startPos;
            var ball = new Ball( xPos, yPos, 80);

            this.ballsCase2.push(ball);

            startPos += 80;

            this.ballsCase2VelTheta.push(count * .003);
            this.ballsCase2Theta.push(0);

            count++;
        }

        // ------------------

        this.ballCase3 = [
            new Ball(Math.random() * windowWid, Math.random() * windowHig, 50 + parseInt(Math.random() * 100) ),
            new Ball(Math.random() * windowWid, Math.random() * windowHig, 50 + parseInt(Math.random() * 100) ),
            new Ball(Math.random() * windowWid, Math.random() * windowHig, 50 + parseInt(Math.random() * 100) ),
            new Ball(Math.random() * windowWid, Math.random() * windowHig, 50 + parseInt(Math.random() * 100) ),
            new Ball(Math.random() * windowWid, Math.random() * windowHig, 50 + parseInt(Math.random() * 100) ),
            new Ball(Math.random() * windowWid, Math.random() * windowHig, 50 + parseInt(Math.random() * 100) ),
        ]

        // -----------------

        this.ballsCase4Theta = 0;
        this.ballCase4 = [];
        for(var ii = 0; ii <= 21; ii++){
            var size = windowWid /20;
            var xPos =  size * (ii - 1);
            var yPos = windowHig/2;
            var ball = new Ball( xPos, yPos, size/2);

            this.ballCase4.push(ball);
        }

        this.balls = [
            this.ballsCase0,
            this.ballCase4,
            this.ballsCase1,
            this.ballsCase2,
            this.ballCase3
        ]

    }

    frame() {
        var i, j, c;
        if(this.type == 0){
            var hig = AppStore.getWindowHeight();
            this.ballCase0Theta += .05;
            this.ballsCase0[0].pos.y = -(hig/2 - 50) * Math.cos(this.ballCase0Theta) + hig/2;
        }
        else if(this.type == 1){
            this.ballsCase4Theta += 0.02;

            for(var ii in this.ballCase4){
                var ball = this.ballCase4[ii];
                var theta = (this.ballsCase4Theta + ii / 20 * Math.PI);
                ball.pos.y = (Math.cos(theta) /2 + .5) * (AppStore.getWindowHeight() + 100);
            }


        }
        else if(this.type == 2){
            this.ballCase2Theta += 0.05;

            for(var ii in this.ballsCase1){
                var theta = ii / 10 * Math.PI + this.ballCase2Theta;
                var ball = this.ballsCase1[ii];
                ball.pos.x = this.ballCase2Rad * Math.cos(theta) + AppStore.getWindowWidth()/2;
                ball.pos.y = this.ballCase2Rad * Math.sin(theta) + AppStore.getWindowHeight()/2;
            }

        }else if(this.type == 3){
            var winWid = AppStore.getWindowWidth();
            for(var ii in this.ballsCase2){
                this.ballsCase2Theta[ii] += this.ballsCase2VelTheta[ii];

                var ball = this.ballsCase2[ii];
                ball.pos.x = winWid * ( .5 +  Math.sin( this.ballsCase2Theta[ii]) / 2);
            }
        }


        for (var cc in this.composites) {
            if (this.composites[cc]) {
                for (var ii in this.composites[cc].particles) {

                    var particles = this.composites[cc].particles;

                    var velocity = particles[ii].pos.copy().subtract(particles[ii].lastPos).multiply(this.friction);


                    // save last good state
                    particles[ii].lastPos = particles[ii].pos.copy();

                    // gravity
                    particles[ii].pos.addMultipledVector(TIME_STEP * TIME_STEP, this.gravity);
                    // console.log(particles[ii].pos);


                    // interia
                    particles[ii].pos.add(velocity);

                }
            }

        }

        // relax
        var frame = 40;
        var stepCoef = 1 / frame;
        for (var cc in this.composites) {
            if (this.composites[cc]) {
                var constraints = this.composites[cc].constraints;
                for (var ii = 0; ii < frame; ii++) {
                    for (var jj in constraints) {
                        constraints[jj].relax(stepCoef);
                    }
                }
            }

        }

        // bounds checking
        // for(var cc in this.composites){
        // 	var particles = this.composites[cc].particles;
        // 	for(var ii in particles){
        // 		this.bounds(particles[ii]);
        // 	}
        // }

        for (var cc in this.composites) {
            if (this.composites[cc]) {
                var particles = this.composites[cc].particles;

                for (var ii in particles) {

                    this.setCircleBounds(particles[ii]);
                }
            }
        }

    }

    draw(ctx) {
        var ii, cc;
        // this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (cc in this.composites) {
            if (this.composites[cc]) {

                var particleArr = this.composites[cc].particles;
                ctx.beginPath();
                for (var ii = 0; ii < particleArr.length - 1; ii++) {
                    var midX = (particleArr[ii].pos.x + particleArr[ii + 1].pos.x) / 2;
                    var midY = (particleArr[ii].pos.y + particleArr[ii + 1].pos.y) / 2;


                    if (ii == 0) {
                        ctx.moveTo(midX, midY);
                    } else {
                        ctx.quadraticCurveTo(particleArr[ii].pos.x, particleArr[ii].pos.y, midX, midY);
                    }


                }

                ctx.lineWidth = 1;
                ctx.strokeStyle = `rgba( ${this.col}, ${this.alphaArr[cc]} )`;
                //ctx.strokeStyle = "#000"
                ctx.stroke();
            }
        }


    }

    addComposites(composite) {
        this.composites.push(composite);
        var alpha = 0.1;
        this.alphaArr.push(alpha);
    }


    setCircleBounds(particle) {
        for (var jj = 0; jj < this.balls[this.type].length; jj++) {
            var ball = this.balls[this.type][jj];
            var rad = ball.rad;

            var subtractVec = particle.pos.copy().subtract(ball.pos)
            var length = subtractVec.getLength();

            if (rad > length) {
                // console.log('hit');
                // var theta =
                //console.log(subtractVec);
                var theta = Math.atan2(subtractVec.y, subtractVec.x);
                var updatedPosX = rad * Math.cos(theta) + ball.pos.x;
                var updatedPosY = rad * Math.sin(theta) + ball.pos.y;

                particle.pos.x = updatedPosX;
                particle.pos.y = updatedPosY;
            }

        }

    }

    reset(){
        this.type = (this.type + 1) % this.MAX_TYPE;
        this.col = colArr[ parseInt(colArr.length * Math.random())];


        for(var ii = 0; ii < this.composites.length; ii++){
            this.composites[ii].reset();
        }
    }

}

module.exports = Verlet;
