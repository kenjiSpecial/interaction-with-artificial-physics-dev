var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../utils/constants');

var AppAction = {
    startRenderingIndex : function (){
        AppDispatcher.dispatch({
            actionType : AppConstants.START_RENDERING_INDEX
        });
    },

    changeDirectory: function (dir, dataArr) {

        AppDispatcher.dispatch({

            dataArr : dataArr,
            actionType: AppConstants.CHANGE_DIRECTORY

        })

    },

    changeDirectoryToWork : function( ){
        AppDispatcher.dispatch({
            actionType : AppConstants.CHANGE_DIRECTORY_TO_WORK
        });
    },

    backToIndex : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.BACK_TO_INDEX
        })
    },

    onCompleteBallAnimationFromWork : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.ON_COMPLETE_BALL_ANIMATION_FROM_WORK
        })
    },

    /** ---------------------------- */

    loadStart : function(){
        AppDispatcher.dispatch({
            actionType: AppConstants.LOAD_START
        });
    },

    loadDone: function (imageObj) {
        AppDispatcher.dispatch({
            images: imageObj,
            actionType: AppConstants.LOAD_DONE
        });
    },

    /** ---------------------------- */

    onMouseMoveSet: function () {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_MOUSE_MOVE_EVENT
        })
    },
    onMouseMove: function (mouseMovement) {
        AppDispatcher.dispatch({
            mouseMovement: mouseMovement,
            actionType: AppConstants.MOUSE_MOVE
        });
    },
    onWorkUpdte: function (workNum, workData) {
        AppDispatcher.dispatch({
            workData: workData,
            workNumber: workNum,
            actionType: AppConstants.WORK_UPDATE
        });
    },
    onBackgroundAnimationDone: function () {
        AppDispatcher.dispatch({
            actionType: AppConstants.BACK_GROUND_ANIMATION_DONE
        })
    },

    onMouseEnterBall: function (num) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_MOUSE_ENTER_BALL,
            ballNumber: num
        });
    },

    onMouseLeaveBall: function (num) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_MOUSE_LEAVE_BALL,
            ballNumber: num
        });
    },

    onMouseDragBall: function (num, mousePosition) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_DRAG_BALL,
            ballNumber: num,
            mousePosition: mousePosition
        });
    },

    onMouseDragStart: function (number) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_DRAG_BALL_START,
            ballNumber: number
        })
    },

    onMouseDragDone: function () {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_DRAG_BALL_DONE
        })
    },

    onMouseUpOnWindown: function () {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_MOUSE_UP_ON_WINDOW
        });
    },

    onMouseDownOnWindow: function () {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_MOUSE_DOWN_ON_WINDOW
        });
    },

    /** WorkList */
    onTapWork : function(workNumber) {
        AppDispatcher.dispatch({
            actionType : AppConstants.ON_TAP_WORK,
            workNumber : workNumber
        })
    },
    /** WorkList */

    onUpdateCameraPosition: function (cameraPositionY) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_CAMERA_POSITION_UPDATE,
            cameraPositionY : cameraPositionY
        });
    },

    onUpdateCameraPositionX: function(cameraPositionX){
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_CAMERA_POSITION_X_UPDATE,
            cameraPositionX : cameraPositionX
        });
    },

    onAnimationDone : function(){
        AppDispatcher.dispatch({
            actionType: AppConstants.ON_WORK_BALL_ANIMATION_DONE
        });
    },

    forceSetWork : function(workID){
        AppDispatcher.dispatch({
            workID : workID,
            actionType: AppConstants.FORCE_SET_WORK
        });
    },

    renderWork : function(workID) {
        console.log("appactio renderWork " + workID);
        AppDispatcher.dispatch({
            workID : workID,
            actionType : AppConstants.RENDER_WORK
        })
    },

    startWorkAnimation: function(){
        AppDispatcher.dispatch({
            actionType: AppConstants.START_WORK_ANIMATION
        });
    },

    stopWorkAnimation : function(){
        AppDispatcher.dispatch({
            actionType: AppConstants.STOP_WORK_ANIMATION
        });
    },

    onCloseWork : function(){
        AppDispatcher.dispatch({
            actionType : AppConstants.CLOSE_WORK
        });
    },

    onCompleteCameraXAnimation : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.ON_COMPLETE_CAMERA_X_ANIMATION
        })
    },

    onCompleteCameraAnimationFromWork : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.ON_COMPLETE_CAMERA_ANIMATION_FROM_WORK
        })
    },

    onWindowResize : function(){
        AppDispatcher.dispatch({
            actionType : AppConstants.ON_WINDOW_RESIZE
        })
    },

    onOpenAboutContent : function(){
        AppDispatcher.dispatch({
            actionType : AppConstants.OPEN_ABOUT_CONTENT
        });
    },

    closeAboutContentStart : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.CLOSE_ABOUT_CONTENT_START
        })
    },

    closeAboutContentDone : function(){
        AppDispatcher.dispatch({
            actionType : AppConstants.CLOSE_ABOUT_CONTENT_DONE
        })
    },
    onWindowResizeInWork : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.WINDOW_RESIZE_IN_WORK
        })
    },

    /** ----------------------- */

    openMenu : function(){
        AppDispatcher.dispatch({
            actionType : AppConstants.OPEN_MENU
        });
    },

    closeMenu: function(){
        AppDispatcher.dispatch({
            actionType : AppConstants.CLOSE_MENU
        });
    },

    menuAnimationDone : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.MENU_ANIMATION_DONE
        });
    },

    closeAnimationDone : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.CLOSE_MENU_ANIMATION_DONE
        });
    },

    onTapMenu: function(menuName) {
        AppDispatcher.dispatch({
            actionType : AppConstants.TAP_MENU,
            menuName   : menuName
        });
    },

    onTapBottomContent : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.TAP_BOTTOM_CONTENT
        });
    },

    /** ----------------------- */

    workTextAnimationDone : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.WORK_TEXT_ANIMATION_DONE
        });
    },

    onRenderInitIndex : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.RENDER_INIT_INDEX
        })
    },

    onTapCloseButton : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.TAP_CLOSE_BUTTON
        })
    },

    renderIndexDone : function() {
        AppDispatcher.dispatch({
            actionType : AppConstants.RENDER_INDEX_DONE
        })
    }

    /** ----------------------- */


};

module.exports = AppAction;
