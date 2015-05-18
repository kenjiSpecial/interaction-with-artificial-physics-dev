var BaseObject = require('./base-object');
var colArr = ["#E91E63", "#3F51B5"];

class Ball extends BaseObject{
    constructor(x, y, rad){
        super(x, y);

        this.rad = rad || 20;
    }

    start () {
        this.colNum = 0;
        this.col = colArr[this.colNum];
    }

    update(dt){
        super.update(dt);
    }

    draw(ctx){
        ctx.fillStyle = colArr[0];

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.rad, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
}

module.exports = Ball;
