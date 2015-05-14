var CONSTANTS = require('../js/utils/constants');
var CONSTANTS_DATA = require('../js/utils/constants_app');

var WorkStore = require('../js/stores/work-store');
var AppStore = require('../js/stores/app-store');
var AppAction = require('../js/actions/app-action');

var appCollection = [];

var ticker = require('../js/utils/ticker');

var backgroundWhite = require('./component/background-white');

// =============
//   component
// =============

var BoilerApp = require('./apps/boiler-plate/app');
var DemoApp   = require('./apps/sample/demo-app');

// ==========

var selectedNumber;
var app;
var windowWid, windowHig;

var dpr;
var canvas, ctx;

var prevX, prevY, curX, curY, dx, dy;
var TOUCH_START = "touchstart";
var TOUCH_END   = "touchend"
var TOUCH_MOVE  = "touchmove";
var isStart;

function initialize(){

    appCollection.push(new DemoApp());

    AppStore.on(CONSTANTS.START_WORK_ANIMATION, start);
    WorkStore.on(CONSTANTS.STOP_WORK_ANIMATION, stop);

    AppStore.on(CONSTANTS.LOAD_DONE, onLoadStartHandler);
    AppStore.on(CONSTANTS.ON_WINDOW_RESIZE, onWindowResize);
    AppStore.on(CONSTANTS.OPEN_MENU, resume);
    AppStore.on(CONSTANTS.CLOSE_MENU_ANIMATION_DONE, resume);

    backgroundWhite.on("ON_COMPLETE_STOP_ANIMATION", onCompleteStopAnimationHandler)
    window.addEventListener('orientationchange', onOrientationChangeHandler);
}

function onLoadStartHandler(){
    windowWid = window.innerWidth;
    windowHig = window.innerHeight;

    dpr = window.devicePixelRatio || 1;
    canvas = document.getElementById("app-canvas");

    canvas.style.width = windowWid + "px";
    canvas.style.height = windowHig + "px";

    canvas.width = windowWid * dpr;
    canvas.height = windowHig * dpr;

    ctx = canvas.getContext("2d");
    ctx.scale( dpr, dpr );
}

function start(){
    isStart = true;
    canvas.style.display = "block";
    var data = WorkStore.getWorkData();
    selectedNumber = data.workNum
    app = appCollection[selectedNumber];
    backgroundWhite.start();


    window.addEventListener(TOUCH_START, onTouchStartHandler);
    window.addEventListener(TOUCH_MOVE, onTouchMoveHandler);
    window.addEventListener(TOUCH_END, onTouchEndHandler);



    ticker.addListener(CONSTANTS.TICK, update);
}

function stop(){
    //ticker.removeListener(CONSTANTS.TICK, update);
    backgroundWhite.stop();

    window.removeEventListener(TOUCH_START, onTouchStartHandler);
    window.removeEventListener(TOUCH_MOVE, onTouchMoveHandler);
    window.removeEventListener(TOUCH_END, onTouchEndHandler);

}

function update(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    app.update(ctx);

    backgroundWhite.update(ctx);
}

function onCompleteStopAnimationHandler(){
    ticker.removeListener(CONSTANTS.TICK, update);
    canvas.style.display = "none";
}

function onWindowResize(){
    //windowWid = window.innerWidth;
    //windowHig = window.innerHeight;
    onOrientationChangeHandler();
}

function onTouchStartHandler(ev){
    var touch = ev.changedTouches[0];
    prevX = curX = touch.clientX;
    prevY = curY = touch.clientY;

    ev.preventDefault();
}

function onTouchMoveHandler(ev){
    var touch = ev.changedTouches[0];
    curX = touch.clientX;
    curY = touch.clientY;

    dx = curX - prevX;
    dy = curY - prevY;

    prevX = curX;
    prevY = curY;

    ev.preventDefault();
}

function onTouchEndHandler(ev) {
    var touch = ev.changedTouches[0];
    prevX = curX = touch.clientX;
    prevY = curY = touch.clientY;

    ev.preventDefault();
}

function resume(){
    if(!AppStore.get("isWorkSelected")) return;

    if(AppStore.isMenuOpen()){
        ticker.removeListener(CONSTANTS.TICK, update);
    }else{
        ticker.addListener(CONSTANTS.TICK, update);
    }

}

function onOrientationChangeHandler(){
    windowWid = window.innerWidth;
    windowHig = window.innerHeight;

    dpr = window.devicePixelRatio || 1;

    canvas.style.width = windowWid + "px";
    canvas.style.height = windowHig + "px";

    canvas.width = windowWid * dpr;
    canvas.height = windowHig * dpr;

    ctx.scale( dpr, dpr );
}


initialize();

module.exports = appCollection;
