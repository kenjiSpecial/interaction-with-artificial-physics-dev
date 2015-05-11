var AppStore = require('../../../stores/app-store');
var WorkStore = require('../../../stores/work-store');
var AppAction = require('../../../actions/app-action');

var APP_CONSTANTS = require('../../../utils/constants');
var APP_CONSTANT_DATAS = require('../../../utils/constants_app');

var s = require('react-prefixr');
var TweenLite = require('gsap');

var ticker = require('../../../utils/ticker');

class WorkBall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {posX: 0, posY: 0, theta: 0, display: "block", flipClass: "flipper"};


        this.isMouseDown = false;

        this.onClickedWorkUpdate = this.onClickedWorkUpdate.bind(this)
    }

    componentWillMount() {
        var WORK_UPDATE = "WORK_TYPE" + this.props.number;

        /** ============================================== */

        AppStore.on(WORK_UPDATE, this.onMouseMoveHandler.bind(this));

        //AppStore.on(APP_CONSTANTS.ON_CLICK_WORK, this.onClickedWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_COMPLETE_CAMERA_X_ANIMATION, this.onCompleteCameraXAnimationHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_CLICK_TEXT, this.onClickText.bind(this));

        AppStore.on(APP_CONSTANTS.FORCE_SET_WORK, this.onForceSetWorkHandler.bind(this));

        WorkStore.on(APP_CONSTANTS.CHANGE_DIRECTORY_TO_WORK, this.onChangeDirectoryToWork.bind(this));
        AppStore.on(APP_CONSTANTS.CHANGE_DIRECTORY_TO_INDEX, this.onChangeDirectoryToIndex.bind(this));
        AppStore.on(APP_CONSTANTS.BACK_TO_INDEX, this.onBackToIndex.bind(this));

        AppStore.on(APP_CONSTANTS.RENDER_WORK, this.onRenderWork.bind(this));
        AppStore.on(APP_CONSTANTS.ON_WINDOW_RESIZE, this.onWindowResizeHandler.bind(this));
        AppStore.on(APP_CONSTANTS.WINDOW_RESIZE_IN_WORK, this.onWindowResizeInWork.bind(this));
    }

    onMouseMoveHandler() {
        if (AppStore.get("isAnimationFromTopToWork") && AppStore.get("selectedWorkNumber") == this.props.number) return;


        var workData = AppStore.getWorkData(this.props.number).workData;
        var workDataLastNum = workData.length - 1;

        var dx = workData[workDataLastNum].pos.x - workData[workDataLastNum - 1].pos.x;
        var dy = workData[workDataLastNum].pos.y - workData[workDataLastNum - 1].pos.y

        var theta = Math.atan2(dy, dx) / Math.PI * 180 - 90;

        this.setState({
            posX: workData[workDataLastNum].pos.x - AppStore.get("cameraPosX"),
            posY: workData[workDataLastNum].pos.y - AppStore.get("cameraPosY"),
            theta: theta
        });
    }

    onMouseEnterHandler() {

        AppAction.onMouseEnterBall(this.props.number);
    }

    onMouseLeaveHandler() {
        AppAction.onMouseLeaveBall(this.props.number);

        //this.isMouseDown = false;
        //AppAction.onMouseDragDone();
    }

    onBallMouseMoveHandler(ev) {
        //if(!this.isMouseDown) return;

        //AppAction.onMouseDragBall(this.props.number, {x: ev.clientX, y: ev.clientY})
    }

    onMouseDownHandler(ev) {

        //this.isMouseDown = true;
        AppAction.onMouseDragStart(this.props.number);
    }

    onMouseUpHandler(ev) {
        //this.isMouseDown = false;
        //AppAction.onMouseDragDone();
    }

    onClickHandler(ev) {
        if (AppStore.get("isAnimationFromTopToWork") || AppStore.get("isAnimationFromWorkToTop")) return;


        if (WorkStore.isSelected()) {
            AppAction.onCloseWork();
        } else {
            AppAction.onClickWork(this.props.number, this.state.posX);
        }

    }

    onRenderWork(num) {
        if (num == this.props.number) {
            setTimeout(function () {
                AppAction.onClickWork(this.props.number, this.state.posX);
            }.bind(this), 0);
        }
    }

    onClickText(workNumber) {
        if (workNumber != this.props.number) return;

        setTimeout(function () {
            AppAction.onClickWork(this.props.number, this.state.posX);
        }.bind(this), 0);
    }

    onCompleteCameraXAnimationHandler(workNumber) {
        if (AppStore.get("selectedWorkNumber") != this.props.number) return;


        this.cameraPosX = AppStore.get("cameraPosX");
        this.cameraPosY = AppStore.get("cameraPosY");


        this.selectedWorkPosX = this.state.posX + this.cameraPosX;
        this.selectedWorkPosY = this.state.posY + this.cameraPosY;

        var delay = 0;
        var duration = .6;

        var windowHig = window.innerHeight;
        if(windowHig < APP_CONSTANT_DATAS.MIN_HEIGHT) windowHig = APP_CONSTANT_DATAS.MIN_HEIGHT;

        TweenLite.to(this, duration, {
            selectedWorkPosY: -windowHig / 2,
            delay: .1,
            ease: Power4.easeOut,
            onUpdate: this.onClickedWorkUpdate.bind(this),
            onComplete: this.onCompleteBallYAnimationHandler.bind(this)
        })
        TweenLite.to(this, 1.0, {
            cameraPosY: -windowHig,
            delay: .5,
            ease: Power2.easeInOut,
            onUpdate: this.onCameraPositionYUpdate.bind(this),
            onComplete: this.onCameraPositionYAnimationDone.bind(this)
        });
    }


    onClickedWorkUpdate() {
        this.setState({
            posX: this.selectedWorkPosX - AppStore.get("cameraPosX"),
            posY: this.selectedWorkPosY - AppStore.get("cameraPosY")
        });
    }

    onCompleteBallYAnimationHandler() {

        this.setState({
            posX: 50,
            theta: 0
        });
    }


    onCameraPositionYUpdate() {
        AppAction.onUpdateCameraPosition(this.cameraPosY);


        this.setState({

            posY: this.selectedWorkPosY - AppStore.get("cameraPosY")
        });
    }

    onCameraPositionYUpdate2() {
        AppAction.onUpdateCameraPosition(this.cameraPosY);
    }

    onCameraPositionYAnimationDone() {
        //console.log('onCameraPositionYAnimationDone');
        AppAction.onAnimationDone();
    }

    onCameraPositionYAnimationDoneFromWork() {
        //console.log('onCameraPositionYAnimationDoneFromWork');
    }

    onChangeDirectoryToWork() {
        var workData = WorkStore.getWorkData();
        if (workData.workNum != this.props.number) {
            this.setState({
                display: "none"
            });
            return;
        }

        this.setState({
            flipClass: "flipper rotated"
        });

        setTimeout(function () {
            AppAction.statrWorkAnimation();
        }, 1000);
    }

    onChangeDirectoryToIndex() {
        var workData = WorkStore.getWorkData();
        if (workData.workNum != this.props.number){
            this.setState({display: "block"})
            return;
        }

        setTimeout(function () {
            this.setState({
                flipClass: "flipper"
            });
        }.bind(this), 600);


        setTimeout(function () {
            AppAction.stopWorkAnimation();
        }, 0);
    }

    onForceSetWorkHandler() {

        if (AppStore.get('selectedWorkNumber') != this.props.number) {

            this.setState({
                display: "none"
            });

            return;
        }

        var workData = AppStore.getWorkData(this.props.number).workData;


        this.selectedWorkPosX = APP_CONSTANT_DATAS.selectedWorkCameraXPos;
        var windowHig = window.innerHeight;
        if(windowHig < APP_CONSTANT_DATAS.MIN_HEIGHT) windowHig = APP_CONSTANT_DATAS.MIN_HEIGHT;

        this.selectedWorkPosY = -windowHig / 2;

        this.setState({
            posX: this.selectedWorkPosX,
            posY: windowHig/2
        });
    }

    onCompleteAnimationFromWork() {
        AppAction.onCompleteBallAnimationFromWork();
    }

    onCompleteCameraAnimationFromWork() {
        AppAction.onCompleteCameraAnimationFromWork();
    }

    onBackToIndex() {
        if (AppStore.get('selectedWorkNumber') != this.props.number) {
            return;
        }

        var workData = AppStore.getWorkData(this.props.number).workData;
        var workDataLastNum = workData.length - 1;

        var targetPosY = workData[workDataLastNum].pos.y; //- AppStore.get("cameraPosY");

        var duration = 1.0;

        //this.selectedWorkPosY = -window.innerHeight/2;
        this.cameraPosX = AppStore.get("cameraPosX");
        this.cameraPosY = AppStore.get("cameraPosY");

        this.selectedWorkPosX = this.state.posX + this.cameraPosX;
        this.selectedWorkPosY = this.state.posY + this.cameraPosY;

        //console.log(this.cameraPosY);

        TweenLite.to(this, .8, {
            selectedWorkPosY: targetPosY,
            ease: Back.easeInOut.config(1),
            onUpdate: this.onClickedWorkUpdate.bind(this),
            onComplete: this.onCompleteAnimationFromWork.bind(this)
        })
        TweenLite.to(this, duration, {
            cameraPosY: 0,
            delay: .6,
            ease: Power2.easeInOut,
            onUpdate: this.onCameraPositionYUpdate2.bind(this),
            onComplete: this.onCompleteCameraAnimationFromWork.bind(this)
        });
    }

    onWindowResizeHandler() {
        if (WorkStore.isSelected() && WorkStore.getWorkData().workNum == this.props.number) {

            setTimeout(function () {
                AppAction.onWindowResizeInWork();
            }, 0);
        }
    }

    onWindowResizeInWork(dy) {
        if (WorkStore.getWorkData().workNum == this.props.number) {

            var windowHig = window.innerHeight;
            if(windowHig < APP_CONSTANT_DATAS.MIN_HEIGHT) windowHig = APP_CONSTANT_DATAS.MIN_HEIGHT;

            this.setState({
                posY : windowHig/2
            });
        } else {
            var camPosY = this.state.posY + dy
            this.setState({
                posY: camPosY
            });
        }

    }

    // -------------------------
    // -------------------------

    render() {

        var divStyle = s({transform: `translate(${this.state.posX}px, ${this.state.posY}px) rotate(${this.state.theta}deg)`});
        divStyle.display = this.state.display;

        return (
            <div className="flip-container work-ball" style={divStyle}
                 onMouseEnter={this.onMouseEnterHandler.bind(this)}
                 onMouseLeave={this.onMouseLeaveHandler.bind(this)}
                 onMouseDown={this.onMouseDownHandler.bind(this)}
                 onMouseUp={this.onMouseUpHandler.bind(this)}
                 onMouseMove={this.onBallMouseMoveHandler.bind(this)}
                 onClick={this.onClickHandler.bind(this)}>

                <div className="flip-container">
                    <div className={this.state.flipClass}>

                        <div className="front">
                            {this.props.name}
                        </div>
                        <div className="back">
                            <div className="cross"></div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

module.exports = WorkBall;
