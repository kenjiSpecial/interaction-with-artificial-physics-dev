var Vec2 = require('ks-vector').Vector2;
var Verlet = require('./verlet/verlet.js');

var Particle = require('./verlet/particle.js');
var Composite = require('./verlet/composite.js');
var Ball = require('./verlet/ball.js');
var DistanceConstraint = require('./verlet/constraints/distance.js');

var TweenLite = require('gsap');

// -----------------------------

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');
var canvasApp = require('../../../js/components/js/canvas-app');

var interactive = "interactive";

function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
}

class App {
    constructor() {
        this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
        this.isTransit = false;
        this.globalAlpha = 0;

        this.sim = new Verlet(AppStore.getWindowWidth(), AppStore.getWindowHeight());

        for(var ii = 0; ii < 5; ii++){
            this.addLine(ii);
        }

    }

    start(){
        this.canvas = document.getElementById('app-canvas');
        addClass(this.canvas, interactive);

        this.sim.reset();
        this.globalOpacity  = 1;
        AppStore.addListener(CONSTANTS.MOUSE_DOWN_IN_CANVAS_APP, this.onMouseDownHandler)
    }

    stop(){
        console.log(this.canvas);
        AppStore.removeListener(CONSTANTS.MOUSE_DOWN_IN_CANVAS_APP, this.onMouseDownHandler)
        removeClass(this.canvas, interactive);
    }

    addLine(num){
        var line = new Composite();
        var vecArr = [];

        var xPos = -100 * Math.random();
        var finalXPos = 100 * Math.random() + window.innerWidth;

        while (xPos < finalXPos) {
            var yPos = -50 * Math.random() - 50 * num;
            var width = 20 + 40 * Math.random();


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
    }

    update(ctx, bg) {
        if(bg.isAnimation){

        }else{

            this.sim.frame();
            this.sim.draw(ctx);

            if(this.isTransit){
                ctx.save();
                ctx.globalAlpha = this.globalAlpha;
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, AppStore.getWindowWidth(), AppStore.getWindowHeight());
                ctx.restore();
            }
        }
    }

    onMouseDownHandler(ev){
        if(this.isTransit) return;

        this.isTransit = true;

        this.globalAlpha = 0;
        TweenLite.to( this, .3, {globalAlpha: 1, onComplete: this.alphaTweenCompleteHandler.bind(this)} )
    }

    alphaTweenCompleteHandler(){
        this.globalAlpha = 0;
        this.isTransit = false;
        this.sim.reset();
    }

}

module.exports = App;
