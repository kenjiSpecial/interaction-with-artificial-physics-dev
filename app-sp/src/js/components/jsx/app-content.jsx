import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

import WorkText from "./app-contents/work-text.jsx"

var AppConstants = require('../../utils/constants');

var CloseButton = require('./app-contents/close-button.jsx');

var Tappable = require('react-tappable');

var TweenLite = require('gsap');

class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            works: AppData.works,
            className: "content-wrapper",
            titleClassName: "content-title",
            workTextListDisplay: "block",
            appOverflow: "visible",
            contentTitle : "LISTS"
        };

        AppStore.on(AppConstants.OPEN_MENU, this.openMenuHandler.bind(this));
        AppStore.on(AppConstants.CLOSE_MENU, this.closeMenuHandler.bind(this));
        AppStore.on(AppConstants.CLOSE_MENU_ANIMATION_DONE, this.onCloseMenuAnimationDone.bind(this));
        AppStore.on(AppConstants.TAP_MENU, this.closeMenuHandler.bind(this));
        AppStore.on(AppConstants.TAP_BOTTOM_CONTENT, this.closeMenuHandler.bind(this));
        AppStore.on(AppConstants.WORK_TEXT_ANIMATION_DONE, this.onWorkTextAnimationDoneHandler.bind(this));
        AppStore.on(AppConstants.FORCE_SET_WORK, this.onWorkTextAnimationDoneHandler.bind(this));
        AppStore.on(AppConstants.BACK_TO_INDEX, this.onBackToIndexHandler.bind(this));
    }

    onLoadDoneHandler() {

    }

    componentWillMount() {
        if (AppStore.selectedClassName() == this.props.name) {
            this.state.className = "content-wrapper selected";
        }
    }

    componentDidMount() {
        this.containerDom = document.getElementById("app-main-wrapper");
        this.cover = this.containerDom.querySelector(".content-title");

    }

    onBackgroundAnimationDoneHandler() {

    }

    closeMenuHandler() {
        if (AppStore.selectedClassName() == this.props.name) {
            TweenLite.to(this.containerDom, .6, {y: "0px"});
            TweenLite.to(this.containerDom, .5, {
                scale: 1,
                ease: Expo.easeOut,
                delay: .3,
                onComplete: this.selectedTweenComplete.bind(this)
            });
        } else {
            TweenLite.to(this.containerDom, .7, {
                scale: .7,
                y: window.innerHeight,
                ease: Expo.easeOut,
                onComplete: this.notSelectedTweenComplete.bind(this)
            })
        }

        TweenLite.to(this.cover, .5, {opacity: 0, onComplete: this.coverTweenComplete.bind(this)});


    }

    coverTweenComplete() {
        this.cover.style.display = "none";
    }

    notSelectedTweenComplete() {
        this.containerDom.style.display = "none";
    }

    selectedTweenComplete() {

    }

    onWorkTextAnimationDoneHandler() {
        setTimeout(function () {
            this.setState({
                contentTitle : "EXPERIMENT",
                workTextListDisplay: "none",
                appOverflow: "hidden"
            });
        }.bind(this), 10)

    }

    openMenuHandler() {
        this.containerDom.style.display = "block";
        //this.containerDom.style.borderTop = "1px solid #ccc";
        TweenLite.to(this.containerDom, .6, {scale: .7, y: "190px", ease: Expo.easeOut});

        this.cover.style.display = "block";

        TweenLite.to(this.cover, .6, {opacity: 1});

        if (!AppStore.get("isWorkSelected")) {
            this.setState({appOverflow: "hidden"});
        }
    }

    onCloseMenuAnimationDone() {
        if (!AppStore.get("isWorkSelected")) {
            this.setState({appOverflow: "visible"});
        }
    }

    onTapHandler() {
        if (!AppStore.get("isMenuOpen")) return;

        AppAction.onTapMenu(this.props.name);
    }

    onBackToIndexHandler(){
        this.setState({
            contentTitle : "LISTS",
            workTextListDisplay: "block",
            appOverflow: "visible"
        });

    }

    render() {
        var count = -1;

        var appMainDomWrapperStyle = {
            display: this.state.workTextListDisplay
        }

        var appStyle = {
            overflow: this.state.appOverflow
        }


        return (
            <Tappable id="app-main-wrapper"
                      className={this.state.className}
                      onTap={this.onTapHandler.bind(this)}
                      style={appStyle}>
                <div className="content-container">
                    <canvas id="app-canvas"></canvas>

                    <div id="app-main-dom-wrapper" style={appMainDomWrapperStyle}>
                        <div className="work-text-wrapper">

                            {
                                this.state.works.map(function (result) {
                                    count++;
                                    var keyID = "work-text" + count;
                                    return (
                                        <WorkText key={keyID} name={result} number={count}></WorkText>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className="content-title">
                        <div className="content-title-text">{this.state.contentTitle}</div>
                    </div>
                </div>

                <CloseButton></CloseButton>

            </Tappable>
        );
    }
}

AppContent.defaultProps = {name: "app"};

module.exports = AppContent;
