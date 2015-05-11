var Vec2 = require('ks-vector').Vector2;

class DistanceConstraints {
    constructor(a, b, stiffness, distance) {
        this.a = a;
        this.b = b;
        this.distance = typeof distance != "undefined" ? distance : a.pos.copy().subtract(b.pos).getLength();
        this.stiffness = stiffness;
    }

    relax(stepCoef) {

        var normalX = this.a.pos.x - this.b.pos.x;
        var normalY = this.a.pos.y - this.b.pos.y;
        var m = normalX * normalX + normalY * normalY;
        var multiplyVal = ((this.distance * this.distance - m) / m) * this.stiffness * stepCoef;
        //if(multiplyVal > .0001){
            normalX *= multiplyVal;
            normalY *= multiplyVal;

            this.a.pos.x += normalX;
            this.a.pos.y += normalY;

            this.b.pos.x -= normalX;
            this.b.pos.y -= normalY;
        //}

    }

    draw(ctx, alpha) {
        ctx.beginPath();
        ctx.moveTo(this.a.pos.x, this.a.pos.y);
        ctx.lineTo(this.b.pos.x, this.b.pos.y);

        ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
        ctx.stroke();
    }
}

module.exports = DistanceConstraints;
