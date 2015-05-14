var TweenLite = require('gsap');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var CONSTANT_DATA = require('../../js/utils/constants_app');

var Background = function(){
    EventEmitter.call(this);
    _.bindAll(this, 'onCompleteHandler', 'onCompleteStopAnimationHandler' );
    this.width = window.innerWidth;
    this.height = window.innerHeight;
}

Background.prototype = Object.create(EventEmitter.prototype); // See note below

// Set the "constructor" property to refer to Student
Background.prototype.constructor = Background;

Background.prototype.start = function(){
    this.isAnimation = true;

        var windowWid = window.innerWidth;
        if (windowWid < CONSTANT_DATA.MIN_WIDTH) windowWid = CONSTANT_DATA.MIN_WIDTH;
        this.width = windowWid;

        var windowHig = window.innerHeight;
        if (windowHig < CONSTANT_DATA.MIN_HEIGHT) windowHig = CONSTANT_DATA.MIN_HEIGHT;
        this.height = windowHig;

        TweenLite.to(this, .8, {height: -3, ease: Power3.easeInOut, onComplete: this.onCompleteHandler })
};

Background.prototype.update = function(ctx) {
    if(!this.isAnimation) return;

    ctx.fillStyle = "#ffffff";

    //if(this.width>0) ctx.fillRect(window.innerWidth - this.width, 0, this.width, this.height);
    ctx.fillRect( 0, 0, this.width, this.height );


    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.moveTo( 0, this.height);
    ctx.lineTo(window.innerWidth, this.height);
    ctx.stroke();
}

Background.prototype.onCompleteHandler = function() {
    this.isAnimation = false;
}

Background.prototype.stop = function() {

    this.isAnimation = true;
    this.height = -3;

    TweenLite.to(this, .6, {height: window.innerHeight + 2, ease: Power3.easeInOut, onComplete: this.onCompleteStopAnimationHandler });
}

Background.prototype.onCompleteStopAnimationHandler = function(){
    this.emit("ON_COMPLETE_STOP_ANIMATION");
    this.isAnimation = false;
}



module.exports = new Background();
