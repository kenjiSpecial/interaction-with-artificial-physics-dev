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

var BoilerApp = require('./apps/boiler-plate/app');
//var DemoApp   = require('./apps/sample/demo-app');
var App01 = require('./apps/00-line-animation-with-circles/app');

// ==========

var selectedNumber;
var app;
var windowWid, windowHig;


function initialize(){

    appCollection.push(new App01());

    WorkStore.on(CONSTANTS.START_WORK_ANIMATION, start);
    WorkStore.on(CONSTANTS.STOP_WORK_ANIMATION, stop);

    backgroundWhite.on("ON_COMPLETE_STOP_ANIMATION", onCompleteStopAnimationHandler)
}

function start(){
    var data = WorkStore.getWorkData();
    selectedNumber = data.workNum
    app = appCollection[selectedNumber];
    backgroundWhite.start();

    ticker.addListener(CONSTANTS.TICK, update);
}

function stop(){
    backgroundWhite.stop();
}

function update(){
    app.update(canvasApp.ctx);

    backgroundWhite.update(canvasApp.ctx);
}

function onCompleteStopAnimationHandler(){
    ticker.removeListener(CONSTANTS.TICK, update);
    AppAction.backToIndex();
}



initialize();

module.exports = appCollection;
