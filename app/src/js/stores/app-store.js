var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var APP_CONSTANTS = require('../utils/constants');
var CONSTANT_DATA = require('../utils/constants_app');
var constants = require('../utils/constants_app');
var appData = require('../data/app-data');
var appAction = require('../actions/app-action');
var assign = require('object-assign');

APP_CONSTANTS.WORKS_UPDATE = [];


var _apps = {
    isLoad : false,
    images : {},
    works : [],
    workTotalSize : 0,
    scrollX : 0,
    scrollY : 0,

    minScrollX : -9999,
    maxScrollX : 9999,

    cameraPosY : 0,
    cameraPosX : 0,
    isMouse : false,
    isDragMouse : false,
    dragedBallNumber : null,

    selectedWorkNumber : null,

    isInit : false,
    isOpenAboutContent : false,

    isAnimationFromTopToWork : false,
    isAnimationFromWorkToTop : false,

    isTransition : false,
};

var AppStore = assign({}, EventEmitter.prototype, {
    get : function(id) {
        return _apps[id];
    },

    getAll : function() {
       return _apps;
    },

    getScrollXPosition : function(){
        return _apps["scrollX"];
    },

    getWorkData : function(workNum){
        return _apps.works[workNum];
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

    // -----------------
    //    set method
    // -----------------

    loadStart : function(){
        _apps['isTransition'] = true;

        this.emit(APP_CONSTANTS.LOAD_START);
    },

    changeDirectoryToIndex : function(){
        _apps['isTransition'] = true;

        this.emit(APP_CONSTANTS.CHANGE_DIRECTORY_TO_INDEX);
    },

    setImages : function(images){
        for(var prop in images){
            var image = images[prop];
            _apps.images[prop] = image;
        }
    },

    setWorks : function(){
        for(var ii in appData.works){
            var workName = appData.works[ii];
            var workID = workName.replace(/ /g,"-").toLowerCase();
            var xPos = constants.workGap * (parseInt(ii)) + constants.workXPos;

            var WORK_UPDATE = "WORK_TYPE" + ii;

            var workObj = { id: workID, workNum: ii, type: WORK_UPDATE, name : workName, originXPos: xPos, curXPos: xPos, ballPos: xPos, workData: null }

            _apps.works.push(workObj);
            //APP_CONSTANTS.WORKS_UPDATE.push(WORK_UPDATE);

            _apps.workTotalSize += constants.workGap;
        }

        _apps.minScrollX = - constants.workGap * (appData.works.length - 1);
        var windowWid = window.innerWidth;
        if(windowWid < CONSTANT_DATA.MIN_WIDTH) windowWid = CONSTANT_DATA.MIN_WIDTH;
        _apps.maxScrollX = windowWid - constants.workGap;

    },

    setAppState : function(isLoadDone){
        _apps.isLoad = isLoadDone;
    },

    // -----------------

    changeLoadState : function(){
        this.emit(APP_CONSTANTS.APP_LOAD_DONE);
    },

    onMouseMoveEventHandler : function() {
        this.emit(APP_CONSTANTS.ON_MOUSE_MOVE_EVENT);
    },

    offMouseMoveEventHandler : function() {
       this.emit(APP_CONSTANTS.OFF_MOUSE_MOVE_EVENT);
    },

    onMouseDownOnWindowHandler : function(){

    },

    onMouseUpOnWindowHandler : function(){
        _apps.isDragMouse = false;
    },

    onMouseMove : function(mouseMovement){
        if(_apps.isDragMouse) {
            this.onDragBall(mouseMovement)
            return;
        }

        mouseMovement.x *= 1.5;
        _apps.scrollX += mouseMovement.x;
        var xPos = _apps.scrollX - _apps.cameraPosX;

        if(xPos > _apps.maxScrollX){
            mouseMovement.x = xPos - _apps.maxScrollX;
            _apps.scrollX = _apps.maxScrollX + _apps.cameraPosX;
        }else if(xPos < _apps.minScrollX){
            mouseMovement.x = xPos - _apps.minScrollX;
            _apps.scrollX = _apps.minScrollX + _apps.cameraPosX;
        }



        this.emit(APP_CONSTANTS.MOUSE_MOVE, mouseMovement);
    },

    onWorkUpdate : function( workNumber, workData ){

        _apps.works[workNumber].workData = workData;
        this.emit(APP_CONSTANTS.WORKS_UPDATE[workNumber]);
    },

    onBackgroundAnimationDone : function(){
        _apps['isTransition'] = false;

        this.emit(APP_CONSTANTS.BACK_GROUND_ANIMATION_DONE)
    },

    onMouseEnterBall : function(num) {
        this.emit(APP_CONSTANTS.ON_MOUSE_ENTER_BALL, num);
    },

    onMouseLeaveBall : function(num) {
        this.emit(APP_CONSTANTS.ON_MOUSE_LEAVE_BALL, num);
    },

    onDragBallStart : function(number){
        _apps.isDragMouse = true;
        _apps.dragedBallNumber = number
    },

    onDragBall : function( mouseMovement){
        this.emit(APP_CONSTANTS.ON_DRAG_BALL, _apps.dragedBallNumber, mouseMovement);
    },

    onDragBallDone : function(){
        _apps.isDragMouse = false;
    },

    onClickWork : function(num, workPosX) {

        _apps.selectedWorkNumber = num;

        this.emit(APP_CONSTANTS.ON_CLICK_WORK, num, workPosX);
    },

    onCompleteCameraXAnimation : function(){
        _apps.isAnimationFromTopToWork = true;
        this.emit(APP_CONSTANTS.ON_COMPLETE_CAMERA_X_ANIMATION);
    },

    onClickText : function(workNumber) {
        _apps.isDragMouse = false;
        this.emit(APP_CONSTANTS.ON_CLICK_TEXT, workNumber);
    },

    onCameraPositionUpdate : function (cameraPositionY) {

        _apps.cameraPosY = cameraPositionY;

        this.emit(APP_CONSTANTS.ON_CAMERA_POSITION_UPDATE);
    },

    onCameraPositionXUpdate : function(cameraPositionX){
        _apps.cameraPosX = cameraPositionX;
        //_apps.scrollX =

        this.emit(APP_CONSTANTS.ON_CAMERA_POSITION_X_UPDATE);
    },

    onWorkBallAnimationDoneHandler : function(){
        _apps.isTransition = false;

        setTimeout(function(){
            _apps.isAnimationFromTopToWork = false;
        }, 0);

        this.emit(APP_CONSTANTS.ON_WORK_BALL_ANIMATION_DONE);

    },
    forceSetWork : function(workID){
        _apps.selectedWorkNumber = this.getWorkNumber(workID);
        var windowHig = window.innerHeight;
        if(windowHig < CONSTANT_DATA.MIN_HEIGHT) windowHig = CONSTANT_DATA.MIN_HEIGHT;

        var workData = this.getSelectedWorkData();
        var workCurXPos = workData.curXPos;
        var cameraPosX = -constants.selectedWorkCameraXPos + workCurXPos;
        var cameraPosY     = -windowHig;

        _apps.cameraPosX = cameraPosX;
        _apps.cameraPosY = cameraPosY;
        _apps.isAnimationFromTopToWork = true;

        this.emit(APP_CONSTANTS.FORCE_SET_WORK);

    },

    onCloseWork : function(){
        //_apps.isTransition = true;
        _apps.isDragMouse = false;
        this.emit(APP_CONSTANTS.CLOSE_WORK);
    },

    backToIndex : function() {
        _apps.isAnimationFromWorkToTop = true;

        this.emit(APP_CONSTANTS.BACK_TO_INDEX);
    },

    onCompleteBallAnimationFromWork : function() {
        this.emit(APP_CONSTANTS.ON_COMPLETE_BALL_ANIMATION_FROM_WORK);
    },

    onCompleteCameraAnimationFromWork : function(){
        //this.isAnimationFromWorkToTop = false;
        _apps.isAnimationFromWorkToTop = false;
        _apps.isDragMouse = false;
        _apps['isTransition'] = false;

        this.emit(APP_CONSTANTS.ON_COMPLETE_CAMERA_ANIMATION_FROM_WORK);
    },

    renderWork : function(workID) {
        var num = this.getWorkNumber(workID);
        this.emit(APP_CONSTANTS.RENDER_WORK, num)
    },

    onWindowResize : function() {
        var windowWid = window.innerWidth;
        if(windowWid < CONSTANT_DATA.MIN_WIDTH) windowWid = CONSTANT_DATA.MIN_WIDTH;

        _apps.maxScrollX = windowWid - constants.workGap;

        this.emit(APP_CONSTANTS.ON_WINDOW_RESIZE);
    },

    onOpenAboutContent : function() {
        _apps.isOpenAboutContent = true;

        this.emit(APP_CONSTANTS.OPEN_ABOUT_CONTENT);
    },

    onCloseAboutContentStart : function() {
        console.log('onCloseAboutContentStart');
        this.emit(APP_CONSTANTS.CLOSE_ABOUT_CONTENT_START);
    },
    onCloseAboutContenDone : function() {
        _apps.isOpenAboutContent = false;

        this.emit(APP_CONSTANTS.CLOSE_ABOUT_CONTENT_DONE);
    },
    onWindowResizeInWork : function(){
        var windowHig = window.innerHeight;
        if(windowHig < CONSTANT_DATA.MIN_HEIGHT) windowHig = CONSTANT_DATA.MIN_HEIGHT;
        var dy = _apps.cameraPosY + windowHig;
        _apps.cameraPosY = -windowHig;

        this.emit(APP_CONSTANTS.WINDOW_RESIZE_IN_WORK, dy);
    }

});

/** =============================================== */

AppStore.dispatchToken = AppDispatcher.register(function(action){

    switch (action.actionType){
        case APP_CONSTANTS.LOAD_START:
            AppStore.loadStart();
            break;
        case APP_CONSTANTS.LOAD_DONE:
            AppStore.setWorks();
            AppStore.setImages(action.images);
            AppStore.setAppState(true);

            AppStore.changeLoadState();
           break;

        /** -------------------------- */
        case APP_CONSTANTS.CHANGE_DIRECTORY_TO_INDEX:
            AppStore.changeDirectoryToIndex();
            break;

        /** -------------------------- */
        /**        MOUSE EVENT         */
        /** -------------------------- */

        case APP_CONSTANTS.ON_MOUSE_DOWN_ON_WINDOW:
            AppStore.onMouseDownOnWindowHandler();
            break;
        case APP_CONSTANTS.ON_MOUSE_UP_ON_WINDOW:
            AppStore.onMouseUpOnWindowHandler();
            break;
        case APP_CONSTANTS.ON_MOUSE_MOVE_EVENT:
            AppStore.onMouseMoveEventHandler();
            break;
        case APP_CONSTANTS.OFF_MOUSE_MOVE_EVENT:
            AppStore.offMouseMoveEventHandler();
            break;
        case APP_CONSTANTS.MOUSE_MOVE:
            AppStore.onMouseMove(action.mouseMovement)
            break;

        /** -------------------------- */
        /**       WINDOW EVENT         */
        /** -------------------------- */
        case APP_CONSTANTS.ON_WINDOW_RESIZE:
            AppStore.onWindowResize();
            break;
        break;

        /** -------------------------- */

        case APP_CONSTANTS.WORK_UPDATE:
            AppStore.onWorkUpdate(action.workNumber, action.workData)
            break;
        case APP_CONSTANTS.BACK_GROUND_ANIMATION_DONE:
            AppStore.onBackgroundAnimationDone();
            break;
        case APP_CONSTANTS.ON_MOUSE_ENTER_BALL:
            AppStore.onMouseEnterBall(action.ballNumber);
            break;
        case APP_CONSTANTS.ON_MOUSE_LEAVE_BALL:
            AppStore.onMouseLeaveBall(action.ballNumber);
            break;
        case APP_CONSTANTS.ON_DRAG_BALL:
            AppStore.onDragBall( action.ballNumber, action.mousePosition )
            break;
        case APP_CONSTANTS.ON_DRAG_BALL_START:
            AppStore.onDragBallStart(action.ballNumber);
            break;
        case APP_CONSTANTS.ON_DRAG_BALL_DONE:
            AppStore.onDragBallDone();
            break;
        case APP_CONSTANTS.ON_CLICK_TEXT:
            AppStore.onClickText(action.workNumber);
            break;
        case APP_CONSTANTS.ON_CLICK_WORK:
            AppStore.onClickWork(action.workNumber, action.workPosX);
            break;
        case APP_CONSTANTS.ON_COMPLETE_CAMERA_X_ANIMATION:
            AppStore.onCompleteCameraXAnimation();
            break;
        case APP_CONSTANTS.ON_CAMERA_POSITION_UPDATE:
            AppStore.onCameraPositionUpdate(action.cameraPositionY)
            break;
        case APP_CONSTANTS.ON_CAMERA_POSITION_X_UPDATE:
            AppStore.onCameraPositionXUpdate(action.cameraPositionX)
            break;
        case APP_CONSTANTS.ON_WORK_BALL_ANIMATION_DONE:
            AppStore.onWorkBallAnimationDoneHandler();
            break;
        case APP_CONSTANTS.FORCE_SET_WORK:
            AppStore.forceSetWork(action.workID);
            break;
        case APP_CONSTANTS.CLOSE_WORK:
            AppStore.onCloseWork();
            break;
        case APP_CONSTANTS.BACK_TO_INDEX:
            AppStore.backToIndex();
            break;
        case APP_CONSTANTS.ON_COMPLETE_BALL_ANIMATION_FROM_WORK:
            AppStore.onCompleteBallAnimationFromWork();
            break;
        case APP_CONSTANTS.ON_COMPLETE_CAMERA_ANIMATION_FROM_WORK:
            AppStore.onCompleteCameraAnimationFromWork();
            break;
        case APP_CONSTANTS.RENDER_WORK:
            AppStore.renderWork(action.workID);
            break;
        case APP_CONSTANTS.OPEN_ABOUT_CONTENT:
            AppStore.onOpenAboutContent();
            break;
        case APP_CONSTANTS.CLOSE_ABOUT_CONTENT_START:
            AppStore.onCloseAboutContentStart();
            break;
        case APP_CONSTANTS.CLOSE_ABOUT_CONTENT_DONE:
            AppStore.onCloseAboutContenDone();
            break;
        case APP_CONSTANTS.WINDOW_RESIZE_IN_WORK:
            AppStore.onWindowResizeInWork();
            break;

    }
});

AppStore.setMaxListeners(100);

module.exports = AppStore;

