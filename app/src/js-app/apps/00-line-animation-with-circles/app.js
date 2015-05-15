var Vec2 = require('ks-vector').Vector2;
var Verlet = require('./verlet/verlet.js');

var Particle = require('./verlet/particle.js');
var Composite = require('./verlet/composite.js');
var Ball = require('./verlet/ball.js');
var DistanceConstraint = require('./verlet/constraints/distance.js');

// -----------------------------

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var AppStore = require('../../../js/stores/app-store');
var canvasApp = require('../../../js/components/js/canvas-app');

class App {
    constructor() {

        this.sim = new Verlet(AppStore.getWindowWidth(), AppStore.getWindowHeight());

        var line = new Composite();
        var kankaku = (window.innerWidth - 40) / 4 / 10;
        kankaku = 20;

        var vecArr = [];
        for (var ii = 0; ii < 20; ii++) {
            var xPos = 200 + kankaku * ii;
            var yPos = -100 * Math.random();
            vecArr.push(new Vec2(xPos, yPos));
        }

        var finalXPos = 400;
        //setTimeout(() => this.timerLoop(), 500);


        var stiffness = 5;
        for (var ii in vecArr) {
            var vec = vecArr[ii];
            line.particles.push(new Particle(vec.x, vec.y));
            if (ii > 0) {
                var constraint = new DistanceConstraint(line.particles[ii], line.particles[ii - 1], stiffness)
                line.constraints.push(constraint);
            }
        }

        // line.pin(0);

        this.sim.addComposites(line);

        this.ball = new Ball(window.innerWidth / 2, window.innerHeight / 2, 100);

        this.sim.addBalls(this.ball);

        this.ball = new Ball(window.innerWidth / 2 - 300, window.innerHeight / 2, 100);
        this.sim.addBalls(this.ball);

        this.ball = new Ball(window.innerWidth / 2 + 300, window.innerHeight / 2, 100);
        this.sim.addBalls(this.ball);

        this.ball = new Ball(window.innerWidth / 2 + 300, window.innerHeight / 2, 100);
        this.sim.addBalls(this.ball);

    }

    timerLoop() {
        var kankaku = 20;
        var line = new Composite();
        var vecArr = [];
        var centerPos = window.innerWidth * (.3 + .4 * Math.random());

        /*
         for(var ii = -10; ii < 10; ii++){
         var xPos = centerPos +  kankaku * ii;
         var yPos = -100 * Math.random();

         }*/
        var xPos = -200 * Math.random() + 100
        var finalXPos = -200 * Math.random() + 100 + window.innerWidth;
        while (xPos < finalXPos) {
            var yPos = -100 * Math.random();
            var width = 10 + 20 * Math.random();


            vecArr.push(new Vec2(xPos, yPos));

            xPos += width;
        }

        var stiffness = 5;
        for (var ii in vecArr) {
            var vec = vecArr[ii];
            line.particles.push(new Particle(vec.x, vec.y));
            if (ii > 0) {
                var constraint = new DistanceConstraint(line.particles[ii], line.particles[ii - 1], stiffness)
                line.constraints.push(constraint);
            }
        }

        this.sim.addComposites(line);


        setTimeout(() => this.timerLoop(), 500);
    }

    update() {
        this.sim.frame();
        this.sim.draw();
        // this.ball.draw(this.ctx);
    }

    reset() {

    }
}

module.exports = App;
