var _ = require('lodash');
var Vector2 = require('ks-vector').Vector2;

var Verlet = require('../../../physics-components/verlet/verlet');
var Composite = require('../../../physics-components/verlet/composite');
var constatns = require('../../../utils/constants_app');
var Particle = require('../../../physics-components/verlet/particle');
var DistanceConstraint = require('../../../physics-components/verlet/constraints/distance');

// ------------------------
var APP_CONSTANTS = require('../../../utils/constants');
var AppStore = require('../../../stores/app-store');
var AppAction = require('../../../actions/app-action');
// ========================

var WorkRope = function( num, xPos, workTitle, ctx) {
    _.bindAll(this, 'onDragBallHandler', 'onCompleteCameraXAnimationHandler')
    this.workNumber = num;
    var ii;

    this.targetX = this.x = this.originX = xPos;
    this.gap = 20;

    this.sim = new Verlet();

    this.line = new Composite()

    var vecArr = [];
    var num = 10;

    var textWid = document.getElementById("work-base"+this.workNumber).clientWidth + 90;
    this.lineWid = textWid
    this.gap = textWid / num;


    for(ii = 0; ii < num; ii++){
        var yPos = constatns.workStartPos + ii * this.gap;
        var pos = new Vector2( this.x, yPos );
        vecArr.push(pos);
    }

    var stiffness = 10;
    for(ii in vecArr){
        var vec = vecArr[ii];
        this.line.particles.push(new Particle(vec.x, vec.y));
        if(ii > 0){
            var constraint = new DistanceConstraint( this.line.particles[ii], this.line.particles[ii-1], stiffness);
            this.line.constraints.push(constraint);
        }
    }

    this.pin = this.line.pin(0);

    this.sim.addComposites(this.line);

    //AppStore.on(AppConstants.MOUSE_MOVE, this.updateMousePosition);
    AppStore.on(APP_CONSTANTS.ON_DRAG_BALL, this.onDragBallHandler);
    AppStore.on(APP_CONSTANTS.ON_COMPLETE_CAMERA_X_ANIMATION, this.onCompleteCameraXAnimationHandler);

};

WorkRope.prototype = {
    onDragBallHandler : function(num, mousePos){
        if(num != this.workNumber) return;

        var lastNum = this.line.particles.length-1;

        this.line.particles[lastNum].pos.x += mousePos.x;
        this.line.particles[lastNum].pos.y += mousePos.y;
        this.line.particles[lastNum].lastPos.x = this.line.particles[lastNum].pos.x;
        this.line.particles[lastNum].lastPos.y = this.line.particles[lastNum].pos.y;

    },
    onCompleteCameraXAnimationHandler : function() {

        if(AppStore.get("selectedWorkNumber") != this.workNumber) return;

        var self = this;
        var vel = 10;
        var lastNum = this.line.particles.length-1;

        setTimeout(function(){
            self.line.particles[lastNum].pos.x -= 1;
            self.line.particles[lastNum].pos.y -= self.lineWid ;
        }, 100);
    },
    update : function(ctx){
        var cameraPosY = AppStore.get("cameraPosY");
        var cameraPosX = AppStore.get("cameraPosX");
        this.targetX = AppStore.getScrollXPosition() + this.originX;

        var targetX = this.line.particles[0].pos.x +  (this.targetX - this.line.particles[0].pos.x)*.3;
        var targetY = this.line.particles[0].pos.y ;
        this.pin.update(targetX, targetY);

        this.sim.frame();

        AppAction.onWorkUpdte(this.workNumber, this.line.particles);

        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ///*
        for(var ii = 0; ii < this.line.particles.length; ii++){
            var particle = this.line.particles[ii];

            if(ii == 0){
                ctx.moveTo( particle.pos.x-cameraPosX, particle.pos.y- cameraPosY );
            }else{
               ctx.lineTo( particle.pos.x-cameraPosX, particle.pos.y- cameraPosY );
            }
        }

        ctx.stroke();

    }
}

module.exports = WorkRope;
