var Vec2 = require('ks-vector').Vector2;
var TIME_STEP = require('./constants.js').TIME_STEP;


class Verlet {

    /**
     * @param {Number} width
     * @param {NUmber} height
     * @param {2dContext} ctx
     */

    constructor(width, height, ctx) {
        this.width = width;
        this.height = height;

        this.gravity = new Vec2(0, 1.0);
        this.friction = .99;
        this.groundFriction = 0.8;

        this.balls = [];
        this.composites = [];
    }

    frame() {
        var i, j, c;

        for (var cc in this.composites) {
            if (this.composites[cc]) {
                for (var ii in this.composites[cc].particles) {

                    var particles = this.composites[cc].particles;

                    var velocity = particles[ii].pos.copy().subtract(particles[ii].lastPos).multiply(this.friction);

                    particles[ii].lastPos = particles[ii].pos.copy();

                    particles[ii].pos.add(this.gravity);



                    particles[ii].pos.add(velocity);

                }
            }

        }

        // relax

        var frame = 30;
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

        // ball bounds checking
        /*
        for (var cc in this.composites) {
            if (this.composites[cc]) {
                var particles = this.composites[cc].particles;
                //console.log(cc);
                var isUnderGround = true;
                for (var ii in particles) {
                    var particlePos = particles[ii].pos;
                    //this.bounds(particles[ii]);
                    //this.setCircleBounds(particles[ii]);
                    if (particlePos.y < window.innerHeight) {
                        isUnderGround = false;
                    }
                }

                if (isUnderGround) {
                    this.composites[cc] = null;
                }
            }
        } */
    }

    addBalls(ball) {
        this.balls.push(ball);
    }

    addComposites( composite ){
        this.composites.push(composite);
    }

    setCircleBounds(particle) {
        for (var jj = 0; jj < this.balls.length; jj++) {
            var ball = this.balls[jj];
            var rad = ball.rad;

            var subtractVec = particle.pos.copy().subtract(ball.pos)
            var length = subtractVec.getLength();

            if (rad > length) {

                var theta = Math.atan2(subtractVec.y, subtractVec.x);
                var updatedPosX = rad * Math.cos(theta) + ball.pos.x;
                var updatedPosY = rad * Math.sin(theta) + ball.pos.y;

                particle.pos.x = updatedPosX;
                particle.pos.y = updatedPosY;
            }

        }

    }

}

module.exports = Verlet;
