var AppStore = require('../../../stores/app-store');

var APP_CONSTANTS = require('../../../utils/constants');
var APP_CONSTANT_DATAS = require('../../../utils/constants_app');

var AppAction = require('../../../actions/app-action');

var TweenLite= require('gsap');
var s = require('react-prefixr');

class WorkText extends React.Component {
    constructor(props) {
        super(props)

        this.state = {posX : 0, posY: 60, widthRate: 0, display: "block"};
        this.widthRate = 0;
    }

    componentWillMount(){
        var WORK_UPDATE = "WORK_TYPE" + this.props.number;

        AppStore.on(WORK_UPDATE, this.onMouseMoveHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_MOUSE_ENTER_BALL, this.onMouseEnterBallHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_MOUSE_LEAVE_BALL, this.onMouseLeaveBallHandler.bind(this));

        AppStore.on(APP_CONSTANTS.ON_CLICK_WORK,  this.onClickWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.WINDOW_RESIZE_IN_WORK, this.onWindowResizeInWork.bind(this));
        AppStore.on(APP_CONSTANTS.FORCE_SET_WORK, this.onForceSetWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.CHANGE_DIRECTORY_TO_INDEX, this.onChangeDirectoryToIndexHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_WORK_BALL_ANIMATION_DONE, this.onWorkBallAnimationDoneHandler.bind(this));

    }

    // ================================

    onWorkBallAnimationDoneHandler(){
        this.setState({
            display : "none"
        });
    }

    onForceSetWorkHandler(){
        this.setState({
            display : "none"
        });
    }

    onChangeDirectoryToIndexHandler(){
        this.setState({
            display : "block"
        });
    }

    onMouseMoveHandler(){
        var workData = AppStore.getWorkData(this.props.number).workData;

        this.setState({
            posX : workData[0].pos.x
        })
    }

    onTweenUpdateHandler(){
        this.setState({
            widthRate : this.widthRate
        });
    }

    onMouseOverEventHandler(){
        TweenLite.to(this, .3, {widthRate: 100, onUpdate: this.onTweenUpdateHandler.bind(this), ease: Expo.easeOut });
    }

    onMouseOutEventHandler(){
        TweenLite.to(this, .3, {widthRate: 0, onUpdate: this.onTweenUpdateHandler.bind(this), ease: Expo.easeOut });
    }

    onMouseEnterBallHandler(num){
        if(num != this.props.number) return;
        this.onMouseOverEventHandler();
    }

    onMouseLeaveBallHandler(num){
        if(num != this.props.number) return;
        this.onMouseOutEventHandler();
    }

    onClickEventHandler(){
        if(AppStore.get("isAnimationFromTopToWork")) return;
        AppAction.onClickText(this.props.number);
    }


    onClickWorkHandler() {
        if (this.props.number != AppStore.get("selectedWorkNumber")) return;

        this.selectedWorkPosX = this.state.posX - AppStore.get("cameraPosX");

        var cmaeraMovement = - (APP_CONSTANT_DATAS.selectedWorkCameraXPos - AppStore.get("cameraPosX")) + this.selectedWorkPosX;
        this.cameraPosX = AppStore.get("cameraPosX");

        var delay = Math.abs(  cmaeraMovement / 150 ) /10;
        if(delay > .5) delay = .5

        TweenLite.to(this, delay + .2, {cameraPosX: cmaeraMovement,  ease: Power2.easeOut,  onUpdate: this.onCameraPositionXUpdate.bind(this), onComplete: this.onCameraPositionXComplete.bind(this) });
    }

    onCameraPositionXUpdate () {
        AppAction.onUpdateCameraPositionX(this.cameraPosX);
    }

    onCameraPositionXComplete(){
        AppAction.onCompleteCameraXAnimation();
    }

    onWindowResizeInWork(dy){
        var posY = this.state.posY + dy;

        this.setState({
            posY : posY
        });
    }

    // ================================

    render(){
        var posY = 70 - AppStore.get("cameraPosY");
        var posX = this.state.posX - AppStore.get("cameraPosX");

        var divStyle = s({transform: `translate(${posX}px, ${posY}px) rotate(90deg)`});
        divStyle.display = this.state.display;

        var workBaseID = "work-base" + this.props.number;
        var workActiveID = "work-active" + this.props.number;
        var activeStyle = {
            width: this.state.widthRate + "%"
        }

        return (
            <div className="work-text" style={divStyle}
                 onMouseEnter={this.onMouseOverEventHandler.bind(this)}
                 onMouseLeave={this.onMouseOutEventHandler.bind(this)}
                 onClick={this.onClickEventHandler.bind(this)}>
                <div className="work-wrapper">
                    <div className="work-base" id={workBaseID}><p>{this.props.name}</p></div>
                    <div className="work-active" id={workActiveID} style={activeStyle}><p>{this.props.name}</p></div>
                </div>

            </div>
        );
    }
}

module.exports = WorkText
