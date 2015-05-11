var Vec2 = require('ks-vector').Vector2;

/**
 *
 */
class PinConstraint {
    /**
     * @param {Number} a
     * @param {Vec2} pos
     */
    constructor(a, pos) {
        this.a = a;
        this.pos = pos;
    }

    update(xx, yy) {
        this.a.x = xx;
        this.a.y = yy;

        this.pos.x += (this.a.x - this.pos.x) * .3;
        this.pos.y += (this.a.y - this.pos.y) * .3;
    }

    relax(stepCoef) {
        //this.a.pos = this.pos.copy();
        this.a.pos.x = this.pos.x;
        this.a.pos.y = this.pos.y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0,153,255,0.1)";
        ctx.fill();
    }
}

module.exports = PinConstraint;
