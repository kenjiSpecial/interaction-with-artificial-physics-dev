var MOUSE_MOVE = "mousemove"
var MOUSE_DOWN = "mousedown";
var MOUSE_UP   = "mouseup";
var MOUSE_OUT  = "mouseout";

var CONSTANTS = require('../js/utils/constants');
var CONSTANTS_DATA = require('../js/utils/constants_app');

var WorkStore = require('../js/stores/work-store');
var AppStore = require('../js/stores/app-store');
var AppAction = require('../js/actions/app-action');

var appCollection = [];

var canvasApp = require('../js/components/js/canvas-app');
var ticker = require('../js/utils/ticker');

var backgroundWhite = require('./component/background-white');

// =============
//   component
// =============

//var BoilerApp = require('./apps/boiler-plate/app');
var App00 = require('./apps/00-line-animation-with-circles/app');
var App01 = require('./apps/01-how-many-ball/app');
var App02 = require('./apps/02-four-different-grivities/app');
var App03 = require('./apps/03-balls-are-being-wiped/app');
var App04 = require('./apps/04-colorful-balls-animation/app');
var App05 = require('./apps/05-coordintes-animation/app');

// ==========

var selectedNumber;
var app;
var windowWid, windowHig;


function initialize(){

    appCollection.push(new App00());
    appCollection.push(new App01());
    appCollection.push(new App02());
    appCollection.push(new App03());
    appCollection.push(new App04());
    appCollection.push(new App05());

    WorkStore.on(CONSTANTS.START_WORK_ANIMATION, start);
    WorkStore.on(CONSTANTS.STOP_WORK_ANIMATION, stop);

    backgroundWhite.on("ON_COMPLETE_STOP_ANIMATION", onCompleteStopAnimationHandler)
}

function start(){
    var data = WorkStore.getWorkData();
    selectedNumber = data.workNum;
    app = appCollection[selectedNumber];

    if(app.isBackgroundAnimation) backgroundWhite.start();
    else                          backgroundWhite.reset();

    if(app.start) app.start();

    ticker.addListener(CONSTANTS.TICK, update);
    addWindowEvent();
}

function stop(){
    backgroundWhite.stop();
    app.stop();
    removeWindowEvent();
}

function update(){
    app.update(canvasApp.ctx, backgroundWhite);

    backgroundWhite.update(canvasApp.ctx);
}

function onCompleteStopAnimationHandler(){
    ticker.removeListener(CONSTANTS.TICK, update);
    AppAction.backToIndex();
}

function addWindowEvent(){
    window.addEventListener(MOUSE_DOWN, onMouseDownAppHandler);
}

function removeWindowEvent(){
    window.removeEventListener(MOUSE_DOWN, onMouseDownAppHandler);
}

function onMouseDownAppHandler(){
    AppAction.onMouseDownInCanvasApp();
}


initialize();

module.exports = appCollection;
