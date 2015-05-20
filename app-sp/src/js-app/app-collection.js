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
var App07 = require('./apps/07-painting-with-balls/app');
var App00 = require('./apps/00-line-animation-with-circles/app');
var App01 = require('./apps/01-how-many-ball/app');
var App02 = require('./apps/02-four-different-grivities/app');
var App03 = require('./apps/03-balls-are-being-wiped/app');
var App04 = require('./apps/04-colorful-balls-animation/app');
var App05 = require('./apps/05-coordintes-animation/app');
var App06 = require('./apps/06-reflection-balls/app');
var App08 = require('./apps/08-weaves/app');
var App09 = require('./apps/09-boxes/app');

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

    //appCollection.push(new DemoApp());

    AppStore.on(CONSTANTS.START_WORK_ANIMATION, start);
    WorkStore.on(CONSTANTS.STOP_WORK_ANIMATION, stop);

    appCollection.push(new App07());
    appCollection.push(new App00());
    appCollection.push(new App01());
    appCollection.push(new App02());
    appCollection.push(new App03());
    appCollection.push(new App04());
    appCollection.push(new App05());
    appCollection.push(new App06());
    appCollection.push(new App08());
    appCollection.push(new App09());

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
    console.log('resume');
    if(AppStore.isMenuOpen()){
        if(AppStore.get("selectedClassName") == "app"){
            ticker.removeListener(CONSTANTS.TICK, update);
            window.removeEventListener(TOUCH_START, onTouchStartHandler);
            window.removeEventListener(TOUCH_MOVE, onTouchMoveHandler);
            window.removeEventListener(TOUCH_END, onTouchEndHandler);
        }
    }else{
        if(AppStore.get("selectedClassName") == "app") {
            ticker.addListener(CONSTANTS.TICK, update);
            window.addEventListener(TOUCH_START, onTouchStartHandler);
            window.addEventListener(TOUCH_MOVE, onTouchMoveHandler);
            window.addEventListener(TOUCH_END, onTouchEndHandler);
        }
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
