var AppStore = require('../../../js/stores/app-store');
var Vector2 = require('ks-vector').Vector2;
var MAX_IMPULSE = 5;
var MOUSE_RAD = 100;
var gravity = new Vector2(0, 1);

class ImpulseBall {
    constructor(id){
        this.id  = id;
        this.pos = new Vector2();
        this.prevPos = new Vector2();
        this.vel = new Vector2();
        this.theta = 0;
    }

    reset(){
        this.rad = 10 + 90 * Math.random() | 0;
        var xPos = (AppStore.getWindowWidth() - this.rad * 2) * Math.random() + this.rad;
        var yPos = -this.rad - 100 * Math.random();

        this.pos.set( xPos, yPos );
        this.prevPos.set(xPos, yPos);
        this.vel.set( 0, 0 );
    }

    update( mainShapeArr, ctx ){
        if(this.isWait) return;

        var copiedPos = this.pos.copy();

        this.pos.add( copiedPos.copy().subtract(this.prevPos).add(gravity) )
        this.prevPos = copiedPos;

        var mX = AppStore.get("mouseX");
        var mY = AppStore.get("mouseY");

        var dMx = mX - this.pos.x;
        var dMy = mY - this.pos.y;

        var disM = Math.sqrt(dMx*dMx + dMy * dMy);

        if(disM < MOUSE_RAD + this.rad){
            var theta = Math.atan2( dMy, dMx ) + Math.PI;
            this.theta = theta;

            var xPos = (MOUSE_RAD + this.rad )* Math.cos(theta) + mX;
            var yPos = (MOUSE_RAD + this.rad )* Math.sin(theta) + mY;

            this.pos.set(xPos, yPos);
        }

        for(var ii in mainShapeArr){
            var mainShape = mainShapeArr[ii];
            for(var jj in mainShape.points){
                var point = mainShape.points[jj];
                var dx = point.x + mainShape.x - this.pos.x;
                var dy = point.y + mainShape.y - this.pos.y;

                var dis = Math.sqrt( dx * dx + dy * dy );

                if(dis < this.rad){
                    var impulse = (this.rad - dis) / this.rad * MAX_IMPULSE;
                    impulse *= impulse * MAX_IMPULSE;

                    mainShape.points[jj].y += impulse;
                }
            }
        }


        /*
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc( this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();


        ctx.fillStyle = "#0000ff";
        ctx.beginPath();
        ctx.arc( mX, mY, MOUSE_RAD, 0, 2 * Math.PI);
        ctx.fill();

        var xxPos = MOUSE_RAD * Math.cos(this.theta) + mX;
        var yyPos = MOUSE_RAD * Math.sin(this.theta) + mY;

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc( xxPos, yyPos, 10, 0, 2 * Math.PI);
        ctx.fill();
        */


        if(this.pos.y > AppStore.getWindowHeight() + this.rad) this.reset();

    }

    start(){
        this.reset();
        this.isWait = true;
        var duration = parseInt(this.id) * 300;
        setTimeout( this.onWaitHandler.bind(this), duration );
    }

    onWaitHandler(){
        this.isWait = false;
    }
}


module.exports = ImpulseBall;
