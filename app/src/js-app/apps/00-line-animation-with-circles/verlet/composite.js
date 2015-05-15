var Vec2 = require('ks-vector').Vector2;
var PinConstraint = require('./constraints/pin.js');

var MOUSE_MOVE = "mousemove"
var MOUSE_DOWN = "mousedown";
var MOUSE_UP   = "mouseup";
var MOUSE_OUT  = "mouseout";


class Composite {
    constructor() {
        this.particles = [];
        this.constraints = [];

        this.drawParticles = null;
        this.drawConstraints = null;
    }

    pin(index, pos) {
        pos = pos || this.particles[index].pos.copy();
        var pc = new PinConstraint(this.particles[index], pos);
        this.constraints.push(pc);
        return pc;
    }

    reset() {
        //this.particles.reset();
        for(var ii in this.particles){
            this.particles[ii].reset();
        }
    }
}
;

module.exports = Composite;
