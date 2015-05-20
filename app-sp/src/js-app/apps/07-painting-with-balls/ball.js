var BaseObject = require('./base-object');
var colArr = ["#E91E63", "#3F51B5"];

var imgWid = 107;
var imgHig = 74;

class Ball extends BaseObject{
    constructor(x, y, rad){
        super(x, y);

        this.rad = rad || 20;
        this.col = [0, 0, 0];
    }

    start () {
        this.col = [0, 0, 0];
    }

    update(dt){
        super.update(dt);
    }

    reset( xPos, yPos ){
        this.position.x = this.prevPosition.x = xPos;
        this.position.y = this.prevPosition.y = yPos;

    }

    draw(ctx, imageData, minX, minY, wid, hig ){
        var xPos = parseInt( (this.position.x - minX) / wid * imgWid );
        var yPos = parseInt( (this.position.y - minY) / hig * imgHig );
        xPos = Math.min( Math.max(0, xPos), imgWid - 1);
        yPos = Math.min( Math.max(0, yPos), imgHig - 1);

        var imagePos = 4 * (yPos * imageData.width + xPos);


        var colR = imageData.data[imagePos + 0] || 0;
        var colG = imageData.data[imagePos + 1] || 0;
        var colB = imageData.data[imagePos + 2] || 0;


        this.col[0] += ( colR - this.col[0]) * .1;
        this.col[1] += ( colG - this.col[1]) * .1;
        this.col[2] += ( colB - this.col[2]) * .1;


        ctx.fillStyle = `rgb( ${ this.col[0]|0 }, ${ this.col[1]|0 }, ${ this.col[2]|0 } )`;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.rad, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
}

module.exports = Ball;
