var Point = require('./point');
var widthNum = 31;
var MOUSE_RAD = 100;

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');

class MainShape {
    constructor( yPos ){
        this.x = 0;
        this.y = yPos;
        this.col = "#fff";

        this.fK = .2
        this.ffK = .2;

        this.pointNumber = widthNum;

        this.points = [];

        var width = AppStore.getWindowWidth();
        var gapDistance = width / (this.pointNumber - 1);
        var xPos, ii;

        for( ii = 0; ii < this.pointNumber; ii++ ){
            xPos = gapDistance * ii;
            var myPt = new Point( xPos, 0);
            this.points.push(myPt);
        }
    }

    update( ctx ){
        var ii;

        var mX = AppStore.get("mouseX");
        var mY = AppStore.get("mouseY");

        for(ii = 0; ii < this.pointNumber; ii++){
            var fExtensionY = 0;
            var fForceY      = 0;

            if(ii > 0){
                fExtensionY = this.points[ii - 1].y - this.points[ii].y;
                fForceY += - this.fK * fExtensionY;
            }

            if(ii < this.pointNumber - 1){
                fExtensionY = this.points[ii].y - this.points[ii+1].y;
                fForceY += this.fK * fExtensionY;
            }

            var dx = mX - this.points[ii].x - this.x ;
            var dy = mY - this.points[ii].y - this.y ;
            var dis = Math.sqrt(dx * dx + dy * dy);


            fExtensionY = this.points[ii].y - this.points[ii].baseY;
            fForceY     += this.fK/20 * fExtensionY;

            this.points[ii].acl = - fForceY;
            this.points[ii].vel += this.points[ii].acl;
            this.points[ii].y   += this.points[ii].vel;

            this.points[ii].y   += this.ffK * (this.points[ii].baseY - this.points[ii].y);

            this.points[ii].vel *= .9;

            if(dis < MOUSE_RAD){
                this.points[ii].y += 40;
            }

        }

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        ctx.lineWidth = 2;

        var i;
        for(i = 0; i < this.pointNumber- 1; i++ ){
            var xPos = (this.points[i].x + this.points[i + 1].x)/2;
            var yPos = (this.points[i].y + this.points[i + 1].y)/2;


            if(i == 0) ctx.moveTo(xPos, yPos);
            else       ctx.quadraticCurveTo( this.points[i].x, this.points[i].y, xPos, yPos);

        }


        ctx.strokeStyle = this.col;
        ctx.stroke();

        ctx.restore();

    }


}

module.exports = MainShape;

