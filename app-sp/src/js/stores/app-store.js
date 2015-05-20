var AppDispatcher = require('../dispatcher/dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CONSTANTS = require('../utils/constants');
var appData = require('../data/app-data');
var _apps = {
    isLoad: false,
    isTransition: false,
    isMenuOpen : false,
    isMenuAnimation : false,
    isAnimationWork: false,
    isWorkSelected : false,
    selectedWorkNumber : null,

    selectedClassName : "app",
    works : [],
    images : {},

    isTouchOnCanvasApp : false,
    touchX : 0,
    touchY : 0,
    aclX : 0,
    aclY : 0,
    gravTheta : 1/2*Math.PI,

    windowWid : window.innerWidth,
    windowHig : window.innerHeight
}

var AppStore = assign({}, EventEmitter.prototype, {
    get: function (id) {
        return _apps[id];
    },

    getAll: function () {
        return _apps;
    },

    isMenuOpen : function() {
        return _apps.isMenuOpen;
    },

    selectedClassName : function(){
        return _apps.selectedClassName;
    },

    getSelectedWorkData : function(){
        return _apps.works[_apps.selectedWorkNumber];
    },

    getWorkNumber : function(workID){
        var workNumber = -1;

        for(var ii in _apps.works){
            var _workID = _apps.works[ii]['id'];
            if(_workID == workID){
                workNumber = ii;
            }
        }

        return parseInt(workNumber);
    },

    getCloseButtonTappable: function() {
        if (_apps.isWorkSelected && !_apps.isTransition) {
            return true;
        }else{
            return false;
        }

    },

    getWindowWidth : function() {
        return window.innerWidth
    },

    getWindowHeight : function() {
        return window.innerHeight
    },

    getImages : function() {
        return _apps.images
    },

    getAclX : function() {
        return _apps.aclX
    },

    getAclY : function() {
        return _apps.aclY
    },

    // ================================

    loadStart : function() {
        _apps.isTransition = true;
        this.emit(CONSTANTS.LOAD_START);
    },

    loadDone : function(images) {
        // set Work Data to _apps
        for(var ii in appData.works){
            var workName = appData.works[ii];
            var workID = workName.replace(/ /g,"-").toLowerCase();

            var workObj = { id: workID, workNum: ii, name : workName }

            _apps.works.push(workObj);

            //_apps.workTotalSize += constants.workGap;
        }

        // ------------------------
        // set image data to _apps

        for(var prop in images){
            var image = images[prop];
            _apps.images[prop] = image;
        }

        //_apps.isTransition = false;
        _apps.isLoad = true;

        this.emit(CONSTANTS.LOAD_DONE);
    },



    openMenu : function() {
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = true;

        this.emit(CONSTANTS.OPEN_MENU);
    },

    closeMenu : function() {
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = false;

        this.emit(CONSTANTS.CLOSE_MENU);
    },

    menuAnimationDone : function(){
        _apps.isMenuAnimation = false;

        this.emit(CONSTANTS.MENU_ANIMATION_DONE);
    },

    onCLoseMenuAnimationDone : function(){
        _apps.isMenuAnimation = false;

        this.emit(CONSTANTS.CLOSE_MENU_ANIMATION_DONE);
    },

    onTapMenu : function(menuName) {
        _apps.selectedClassName = menuName;
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = false;

        this.emit(CONSTANTS.TAP_MENU);
    },

    onTapBottomContent : function() {
        _apps.isMenuAnimation = true;
        _apps.isMenuOpen = false;

        this.emit(CONSTANTS.TAP_BOTTOM_CONTENT)
    },

    onTapWork : function(workNumber) {
        _apps.isTransition = true;
        _apps.isAnimationWork = true;
        _apps.isWorkSelected = true;
        _apps.selectedWorkNumber = workNumber;

        this.emit(CONSTANTS.ON_TAP_WORK);
    },

    renderWork : function( workID ) {
        _apps.isTransition = true;
        _apps.isAnimationWork = true;
        _apps.isWorkSelected = true;
        _apps.selectedWorkNumber = this.getWorkNumber(workID)

        this.emit(CONSTANTS.RENDER_WORK);

    },

    onWorkTextAnimationDone : function() {

        this.emit(CONSTANTS.WORK_TEXT_ANIMATION_DONE);
    },

    startWorkAnimation : function() {
        _apps.isTransition = false;
        _apps.isAnimationWork = false;
        _apps.isWorkSelected = true;
        _apps.isTouchOnCanvasApp = false;

        this.emit(CONSTANTS.START_WORK_ANIMATION);
    },

    forceSetWork : function(workID) {
        _apps.selectedWorkNumber = this.getWorkNumber(workID);

        this.emit(CONSTANTS.FORCE_SET_WORK);
    },

    renderInitIndex : function() {
        _apps.isTransition = false;

    },

    onTapCloseButton : function() {
        this.emit(CONSTANTS.TAP_CLOSE_BUTTON);
    },

    startRenderingIndex : function() {
        _apps.isTransition = true;
        _apps.isAnimationWork = true;
        _apps.isWorkSelected = false;
        _apps.isTouchOnCanvasApp = false;

        this.emit(CONSTANTS.START_RENDERING_INDEX);
    },

    backToIndex : function() {
        this.emit(CONSTANTS.BACK_TO_INDEX);

    },

    renderIndexDone : function() {
        _apps.isTransition = false;
        _apps.isAnimationWork = false;

        this.emit(CONSTANTS.RENDER_INDEX_DONE);
    },

    onWindowResize : function() {
        _apps.windowWid = window.innerWidth;
        _apps.windowHig = window.innerHeight;

        this.emit(CONSTANTS.ON_WINDOW_RESIZE);
    },

    onTouchStartCanvasApp : function(xPos, yPos) {
        _apps.isTouchOnCanvasApp = true;
        _apps.touchX = xPos;
        _apps.touchY = yPos;

        this.emit(CONSTANTS.TOUCH_START_CANVAS_APP);
    },

    onTouchEndCanvasApp : function() {
        _apps.isTouchOnCanvasApp = false;

        this.emit(CONSTANTS.TOUCH_END_CANVAS_APP);
    },

    onTouchMoveCanvasApp : function(xPos, yPos) {
        _apps.touchX = xPos;
        _apps.touchY = yPos;


        this.emit(CONSTANTS.TOUCH_MOVE_CANVAS_APP);
    },

    onTapCanvasApp : function() {
        _apps.isTouchOnCanvasApp = false;

        this.emit(CONSTANTS.TAP_CANVAS_APP);
    },

    onDeviceMotion : function( aclX, aclY ) {
        _apps.aclX = aclX;
        _apps.aclY = aclY;

        this.emit(CONSTANTS.ON_DEVICE_MOTION);
    },

    onDeviceChange : function( theta ) {
        console.log(theta);
        _apps.gravTheta = theta;

        this.emit(CONSTANTS.ON_DEVICE_MOTION);
    }

});

AppStore.dispatchToken = AppDispatcher.register(function (action) {
    switch(action.actionType){
        case CONSTANTS.LOAD_START:
            AppStore.loadStart();
            break;
        case CONSTANTS.LOAD_DONE:
            AppStore.loadDone(action.images);
            break;
        case CONSTANTS.OPEN_MENU:
            AppStore.openMenu();
            break;
        case CONSTANTS.CLOSE_MENU:
            AppStore.closeMenu();
            break;
        case CONSTANTS.MENU_ANIMATION_DONE:
            AppStore.menuAnimationDone();
            break;
        case CONSTANTS.CLOSE_MENU_ANIMATION_DONE:
            AppStore.onCLoseMenuAnimationDone()
            break;
        case CONSTANTS.TAP_MENU:
            AppStore.onTapMenu(action.menuName);
            break;
        case CONSTANTS.TAP_BOTTOM_CONTENT:
            AppStore.onTapBottomContent()
            break;
        case CONSTANTS.ON_TAP_WORK:
            AppStore.onTapWork(action.workNumber)
            break;
        case CONSTANTS.WORK_TEXT_ANIMATION_DONE:
            AppStore.onWorkTextAnimationDone();
            break;
        case CONSTANTS.START_WORK_ANIMATION:
            AppStore.startWorkAnimation();
            break;
        case CONSTANTS.FORCE_SET_WORK:
            AppStore.forceSetWork(action.workID);
            break;
        case CONSTANTS.RENDER_INIT_INDEX:
            AppStore.renderInitIndex();
            break;
        case CONSTANTS.TAP_CLOSE_BUTTON:
            AppStore.onTapCloseButton();
            break;
        case CONSTANTS.START_RENDERING_INDEX:
            AppStore.startRenderingIndex();
            break;
        case CONSTANTS.RENDER_INDEX_DONE:
            AppStore.renderIndexDone();
            break;
        case CONSTANTS.BACK_TO_INDEX:
            AppStore.backToIndex();
            break;
        case CONSTANTS.RENDER_WORK:
            AppStore.renderWork(action.workID);
            break;
        case CONSTANTS.ON_WINDOW_RESIZE:
            AppStore.onWindowResize();
            break;
        case CONSTANTS.TOUCH_START_CANVAS_APP:
            AppStore.onTouchStartCanvasApp( action.xPos, action.yPos );
            break;
        case CONSTANTS.TOUCH_END_CANVAS_APP:
            AppStore.onTouchEndCanvasApp();
            break;
        case CONSTANTS.TOUCH_MOVE_CANVAS_APP:
            AppStore.onTouchMoveCanvasApp( action.xPos, action.yPos );
            break;
        case CONSTANTS.TAP_CANVAS_APP:
            AppStore.onTapCanvasApp();
            break;
        case CONSTANTS.ON_DEVICE_MOTION:
            AppStore.onDeviceMotion( action.aclX, action.aclY );
            break;
        case CONSTANTS.ON_DEVICE_CHANGE:
            AppStore.onDeviceChange(action.theta);
            break;
    }

});

AppStore.setMaxListeners(20);

module.exports = AppStore;
