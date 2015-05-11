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

        /*
        AppStore.on(WORK_UPDATE, this.onMouseMoveHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_MOUSE_ENTER_BALL, this.onMouseEnterBallHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_MOUSE_LEAVE_BALL, this.onMouseLeaveBallHandler.bind(this));

        AppStore.on(APP_CONSTANTS.ON_CLICK_WORK,  this.onClickWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.WINDOW_RESIZE_IN_WORK, this.onWindowResizeInWork.bind(this));
        AppStore.on(APP_CONSTANTS.FORCE_SET_WORK, this.onForceSetWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.CHANGE_DIRECTORY_TO_INDEX, this.onChangeDirectoryToIndexHandler.bind(this));
        AppStore.on(APP_CONSTANTS.ON_WORK_BALL_ANIMATION_DONE, this.onWorkBallAnimationDoneHandler.bind(this));
        */

    }

    // ================================

    // ================================

    render(){
        //divStyle.display = this.state.display;

        var workBaseID = "work-base" + this.props.number;
        var workActiveID = "work-active" + this.props.number;
        var activeStyle = {
            width: this.state.widthRate + "%"
        }

        return (
            <div className="work-text"
                 >
                <div className="work-wrapper">
                    <div className="work-base" id={workBaseID}><p>{this.props.name}</p></div>
                    <div className="work-active" id={workActiveID} style={activeStyle}><p>{this.props.name}</p></div>
                </div>

            </div>
        );
    }
}

module.exports = WorkText
