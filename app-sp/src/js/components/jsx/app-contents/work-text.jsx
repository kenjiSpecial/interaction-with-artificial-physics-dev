var AppStore = require('../../../stores/app-store');

var APP_CONSTANTS = require('../../../utils/constants');
var APP_CONSTANT_DATAS = require('../../../utils/constants_app');

var AppAction = require('../../../actions/app-action');

var TweenLite= require('gsap');
var s = require('react-prefixr');
var Tappable = require('react-tappable');

class WorkText extends React.Component {
    constructor(props) {
        super(props)

        this.state = {display: "block", workDisplay: "block", workCoverDisplay: "none", textWidth: 0, textLeft: 0, widthRate: 0};
        this.widthRate = 0;

        AppStore.on(APP_CONSTANTS.ON_TAP_WORK, this.onTapWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.RENDER_WORK, this.onTapWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.FORCE_SET_WORK, this.onForceSetWorkHandler.bind(this));
        AppStore.on(APP_CONSTANTS.BACK_TO_INDEX, this.onBackToIndexHandler.bind(this))
    }

    componentWillMount(){
        var WORK_UPDATE = "WORK_TYPE" + this.props.number;
    }

    componentDidMount(){
        var workID = "work-" + this.props.number;
        var workBaseID = "work-base" + this.props.number;



        this.textDom = document.getElementById(workBaseID);
        this.blackCover = document.getElementById(workID).querySelector(".cover-content");
    }

    // ================================
    onTouchStatHandler(){
        TweenLite.to(this, .3, {widthRate: 100, onUpdate: this.onTweenUpdateHandler.bind(this), ease: Expo.easeOut });
    }

    onTouchEndHandler(){
        TweenLite.to(this, .3, {widthRate: 0, onUpdate: this.onTweenUpdateHandler.bind(this), ease: Expo.easeOut });
    }

    onTapHandler(){
        if(AppStore.get("isAnimationWork") || AppStore.get("isMenuOpen")) return;


        AppAction.onTapWork(this.props.number);
    }

    onTapWorkHandler(){
        this.textWidth = this.textDom.clientWidth;

        this.setState({
            textWidth        : this.textWidth,
            workCoverDisplay : "block"
        });

        TweenLite.set(this.blackCover, {x: -this.textWidth-5})

        TweenLite.to(this.blackCover, .3, {x: 0, onComplete: this.textWidthAnimationComplete1.bind(this), ease: Power2.easeInOut })
    }

    textWidthAnimationComplete1(){

        this.setState({
            workDisplay : "none"
        });

        TweenLite.to(this.blackCover, .3, {x: this.textWidth + 5, onComplete: this.textWidthAnimationComplete2.bind(this) })
    }

    textWidthAnimationComplete2(){

        if(this.props.number === AppStore.get("selectedWorkNumber")){
            AppAction.workTextAnimationDone();
        }

    }


    onTweenUpdateHandler(){
        this.setState({
            widthRate : this.widthRate
        });

    }

    onForceSetWorkHandler() {
        this.textWidth = this.textDom.clientWidth;

        this.setState({
            textWidth        : this.textWidth,
            workCoverDisplay : "none",
            workDisplay : "none"
        });


    }

    onBackToIndexHandler(){
        this.setState({
            workCoverDisplay : "block"
        });

        TweenLite.set(this.blackCover, {x: -this.textWidth-5})

        TweenLite.to(this.blackCover, .3, {x: 0, onComplete: this.textWidthAnimationComplete3.bind(this), ease: Power2.easeInOut, delay: .3 })
    }

    textWidthAnimationComplete3(){
        this.setState({
            workDisplay : "block"
        });

        TweenLite.to(this.blackCover, .3, {x: this.textWidth+5, onComplete: this.textWidthAnimationComplete4.bind(this) })
    }

    textWidthAnimationComplete4(){
        this.setState({
            workCoverDisplay : "none"
        })

        if(this.props.number === AppStore.get("selectedWorkNumber")){
            AppAction.renderIndexDone();
        }

    }

    // ================================

    render(){
        var workTextID = "work-" + this.props.number;
        var workBaseID = "work-base" + this.props.number;
        var workActiveID = "work-active" + this.props.number;

        var mainStyle = {
            display: this.state.display
        }

        var divStyle = {
            width: this.state.textWidth,
            display: this.state.workCoverDisplay
            //left : this.state.textLeft
        }
        //var divStyle = s({transform: `translate(${posX}px, )`});

        var activeStyle = {
            width: this.state.widthRate + "%"
        }

        var textStyle = {
            display : this.state.workDisplay,
            width   : this.state.textWidth
        }

        return (
            <Tappable
                className="work-text"
                style={mainStyle}
                onTap={this.onTapHandler.bind(this)}
                id={workTextID}
                >

                <div className="work-wrapper" style={textStyle}>
                    <div className="work-base" id={workBaseID}><p>{this.props.name}</p></div>
                </div>

                <div className="work-cover" style={divStyle}>
                    <div className="cover-content"></div>
                </div>

            </Tappable>
        );
    }
}

module.exports = WorkText
