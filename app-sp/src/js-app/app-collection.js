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

function initialize(){

    appCollection.push(new DemoApp());

    AppStore.on(CONSTANTS.START_WORK_ANIMATION, start);
    WorkStore.on(CONSTANTS.STOP_WORK_ANIMATION, stop);

    AppStore.on(CONSTANTS.LOAD_DONE, onLoadStartHandler);

    AppStore.on(CONSTANTS.ON_WINDOW_RESIZE, onWindowResize);

    backgroundWhite.on("ON_COMPLETE_STOP_ANIMATION", onCompleteStopAnimationHandler)
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
    canvas.style.display = "block";
    var data = WorkStore.getWorkData();
    selectedNumber = data.workNum
    console.log("selectedNumber: " + selectedNumber);
    app = appCollection[selectedNumber];
    backgroundWhite.start();

    ticker.addListener(CONSTANTS.TICK, update);
}

function stop(){
    //ticker.removeListener(CONSTANTS.TICK, update);
    backgroundWhite.stop();
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
    windowWid = window.innerWidth;
    if(windowWid < CONSTANTS_DATA.MIN_WIDTH) windowWid = CONSTANTS_DATA.MIN_WIDTH;

    windowHig = window.innerHeight;
    if(windowHig < CONSTANTS_DATA.MIN_HEIGHT) windowHig = CONSTANTS_DATA.MIN_HEIGHT;
}


initialize();

module.exports = appCollection;
