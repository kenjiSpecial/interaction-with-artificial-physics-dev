var AppStore = require('../../../stores/app-store');
var WorkStore = require('../../../stores/work-store');
var AppAction = require('../../../actions/app-action');

var APP_CONSTANTS = require('../../../utils/constants');
var APP_CONSTANT_DATAS = require('../../../utils/constants_app');

var s = require('react-prefixr');
var TweenLite = require('gsap');
var Tappable = require('react-tappable');

var ticker = require('../../../utils/ticker');

class CloseButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { posY: 0, display: "none", flipClass: "flipper", flipContainerClass : "flip-container"};


        this.isMouseDown = false;

        this.onClickedWorkUpdate = this.onClickedWorkUpdate.bind(this)
    }

    componentWillMount() {

        WorkStore.on(APP_CONSTANTS.CHANGE_DIRECTORY_TO_WORK, this.onChangeDirectoryToWork.bind(this));
        AppStore.on(APP_CONSTANTS.FORCE_SET_WORK, this.onChangeDirectoryToWork.bind(this));

        AppStore.on(APP_CONSTANTS.CHANGE_DIRECTORY_TO_INDEX, this.onChangeDirectoryToIndex.bind(this));
        AppStore.on(APP_CONSTANTS.BACK_TO_INDEX, this.onBackToIndex.bind(this));
        AppStore.on(APP_CONSTANTS.START_RENDERING_INDEX, this.onTapCloseButtonHandler.bind(this));

    }

    onClickedWorkUpdate() {
        this.setState({
            posX: this.selectedWorkPosX - AppStore.get("cameraPosX"),
            posY: this.selectedWorkPosY - AppStore.get("cameraPosY")
        });
    }


    onChangeDirectoryToWork() {
        this.posY = 100;

        this.setState({
            posY : this.posY,
            flipClass : "flipper",
            display: "block"
        });

        TweenLite.to(this, .3, { delay: .2, posY : 0, ease: Expo.easeOut, onUpdate: this.onTween1Update.bind(this), onComplete: this.onTween1Complete.bind(this)});
    }

    onTween1Update(){
        this.setState({
            posY : this.posY
        })
    }

    onTween1Complete(){
        this.setState({
            posY : this.posY,
            flipClass : "flipper rotated"
        });

        setTimeout(function(){
            AppAction.startWorkAnimation();
        }, 500);
    }

    onChangeDirectoryToIndex() {
        var workData = WorkStore.getWorkData();
        if (workData.workNum != this.props.number) {
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

    }


    onTapHandler(){
        if(!AppStore.getCloseButtonTappable()) return;

        this.setState({
            flipContainerClass : "flip-container active"
        });

        AppAction.onTapCloseButton();
    }

    onTapCloseButtonHandler(){
        this.posY = 0;
        TweenLite.to(this, .3, { delay: .2, posY : 100, ease: Expo.easeOut, onUpdate: this.onTween1Update.bind(this), onComplete: this.onTween2Complete.bind(this) });
    }

    onTween2Complete(){
        this.setState({
            'display' : 'none'
        });

        AppAction.backToIndex();
    }

    // -------------------------
    // -------------------------

    render() {

        var divStyle = s({transform: `translate( 0, ${this.state.posY}px)`});
        divStyle.display = this.state.display;

        return (
            <Tappable className="flip-wrapper"
                      style={divStyle}
                      onTap={this.onTapHandler.bind(this)}
                >
                <div className={this.state.flipContainerClass}>
                    <div className={this.state.flipClass}>

                        <div className="front">
                            {this.state.name}
                        </div>
                        <div className="back">
                            <div className="cross"></div>
                        </div>
                    </div>
                </div>
            </Tappable>
        );
    }
}

module.exports = CloseButton;
