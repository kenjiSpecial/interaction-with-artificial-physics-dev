var MainShape = require('./main-shape');

var CONSTANT_DATA = require('../../../js/utils/constants_app');
var CONSTANTS = require('../../../js/utils/constants');
var AppStore = require('../../../js/stores/app-store');
var BALL_NUM = 2;

var ImpuluseBall = require('./impulse-ball');

class App {
    constructor(){
        this.isBackgroundAnimation = true;
        this.bgCol = "#37474F";
        this.number = 10;

        this.gap = (AppStore.getWindowHeight()) / (this.number + 1);

        this.mainShapeArr = [];
        for(var ii = 0; ii < this.number; ii++){
            var yPos = (ii + 1) * this.gap
            var mainShape = new MainShape( yPos );
            this.mainShapeArr.push(mainShape);
        }

        this.ballArr = [];
        for(var jj = 0; jj < BALL_NUM; jj++){
            var ball = new ImpuluseBall(jj)
            this.ballArr.push(ball);
        }

    }

    start(){
        for(var jj = 0; jj < this.ballArr.length; jj++){
            this.ballArr[jj].start();
        }
    }
    stop(){

    }
    update(ctx){
        ctx.fillStyle = this.bgCol;
        ctx.fillRect( 0, 0, AppStore.getWindowWidth(), AppStore.getWindowHeight());

        for(var ii = 0; ii < this.mainShapeArr.length; ii++){
            this.mainShapeArr[ii].update(ctx);
        }

        // -------------------------

        for(var jj = 0; jj < this.ballArr.length; jj++){
            this.ballArr[jj].update( this.mainShapeArr, ctx );
        }
    }
}

module.exports = App;
