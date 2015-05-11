var history = require('../../router/history');
var TweenLite = require('gsap');
var ticker = require('../../utils/ticker');
var _ = require('lodash');
var CONSTANTS = require('../../utils/constants');
var CONSTANTS_DATA = require('../../utils/constants_app');

// components
var ScrollBar =  require('./canvas-component/scroll-bar');
var WorkRope = require('./canvas-component/work-rope');

var AppStore = require('../../stores/app-store');
var WorkStore = require('../../stores/work-store');

var CanvasApp = function() {
    _.bindAll(this, "onUpdate", "onStopUpdateHandler");
    this.scrollBar = new ScrollBar();

    WorkStore.on(CONSTANTS.CHANGE_DIRECTORY_TO_WORK, this.onStopUpdateHandler);

    AppStore.on(CONSTANTS.ON_COMPLETE_BALL_ANIMATION_FROM_WORK, this.initializeIndex.bind(this));
    AppStore.on(CONSTANTS.ON_WINDOW_RESIZE, this.onWindowResizeHandler.bind(this));
};

CanvasApp.prototype = {
    initialize : function() {
        this.dpr = window.devicePixelRatio || 1;
        this.canvas = document.getElementById("app-canvas");

        var windowWid = window.innerWidth;
        if(windowWid < CONSTANTS_DATA.MIN_WIDTH) windowWid = CONSTANTS_DATA.MIN_WIDTH;

        var windowHig = window.innerHeight;
        if(windowHig < CONSTANTS_DATA.MIN_HEIGHT) windowHig = CONSTANTS_DATA.MIN_HEIGHT;

        this.canvas.style.width = windowWid + "px";
        this.canvas.style.height = windowHig + "px";

        this.canvas.width = windowWid * this.dpr;
        this.canvas.height = windowHig * this.dpr;

        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale( this.dpr, this.dpr );

        this.windowWid = windowWid;
        this.windowHig = windowHig;

        switch(history.getFragment()){
            case "":
                this.initializeIndex();
                break;
        }


    },

    initializeIndex : function(){
        ticker.on(CONSTANTS.TICK, this.onUpdate);
    },

    onStopUpdateHandler : function() {
        ticker.removeListener(CONSTANTS.TICK, this.onUpdate);
    },

    renderIndex : function(){

        this.setWorkRope();

    },

    forceInitialize : function(){
        this.setWorkRope();

        ticker.on(CONSTANTS.TICK, this.onUpdate);
    },

    setWorkRope : function(){
        this.workRopeArr = [];

        var works = AppStore.get('works')
        for(var ii = 0; ii < works.length; ii++){
            var rope = new WorkRope(ii, works[ii].curXPos, works[ii].name, this.ctx);
            this.workRopeArr.push(rope);
        }
    },

    onUpdate : function(){
        this.ctx.clearRect(0, 0, this.windowWid, this.windowHig);
        this.scrollBar.update(this.ctx);

        for(var ii in this.workRopeArr){
            this.workRopeArr[ii].update(this.ctx);
        }

    },

    onWindowResizeHandler : function() {

        var windowWid = window.innerWidth;
        if(windowWid < CONSTANTS_DATA.MIN_WIDTH) windowWid = CONSTANTS_DATA.MIN_WIDTH;

        var windowHig = window.innerHeight;
        if(windowHig < CONSTANTS_DATA.MIN_HEIGHT) windowHig = CONSTANTS_DATA.MIN_HEIGHT;

        this.canvas.style.width = windowWid + "px";
        this.canvas.style.height = windowHig + "px";

        this.canvas.width = windowWid * this.dpr;
        this.canvas.height = windowHig * this.dpr;

        this.windowWid = windowWid;
        this.windowHig = windowHig;

        this.ctx.scale( this.dpr, this.dpr );
    }
}

var canvasApp = new CanvasApp();

module.exports = canvasApp;
