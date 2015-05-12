import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

import WorkText from "./app-contents/work-text.jsx"

var AppConstants = require('../../utils/constants');
var Tappable = require('react-tappable');

var TweenLite = require('gsap');

class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            works: AppData.works,
            className: "content-wrapper",
            titleClassName : "content-title"
        };

        AppStore.on(AppConstants.OPEN_MENU, this.openMenuHandler.bind(this));
        AppStore.on(AppConstants.CLOSE_MENU, this.closeMenuHandler.bind(this));
        AppStore.on(AppConstants.CLOSE_MENU_ANIMATION_DONE, this.onCloseMenuAnimationDone.bind(this));
        AppStore.on(AppConstants.TAP_MENU, this.closeMenuHandler.bind(this));
        AppStore.on(AppConstants.TAP_BOTTOM_CONTENT, this.closeMenuHandler.bind(this));
    }

    onLoadDoneHandler() {

    }

    componentWillMount() {
        if( AppStore.selectedClassName() == this.props.name){
            this.state.className = "content-wrapper selected";
        }
    }

    componentDidMount(){
        this.containerDom = document.getElementById("app-main-wrapper");
        this.cover = this.containerDom.querySelector(".content-title");

    }

    onBackgroundAnimationDoneHandler() {

    }

    closeMenuHandler(){
        if( AppStore.selectedClassName() == this.props.name){
            TweenLite.to(this.containerDom, .6, { y: "0px"});
            TweenLite.to(this.containerDom, .5, {scale: 1, ease: Expo.easeOut, delay: .3, onComplete: this.selectedTweenComplete.bind(this)});
        }else{
            TweenLite.to(this.containerDom, .7, {scale: .7, y: window.innerHeight, ease: Expo.easeOut, onComplete: this.notSelectedTweenComplete.bind(this)})
        }

        TweenLite.to(this.cover, .5, {opacity: 0, onComplete: this.coverTweenComplete.bind(this)  });
    }

    coverTweenComplete(){
        this.cover.style.display = "none";
    }

    notSelectedTweenComplete(){
        this.containerDom.style.display = "none";
    }

    selectedTweenComplete(){
    }

    openMenuHandler() {
        this.containerDom.style.display = "block";
        //this.containerDom.style.borderTop = "1px solid #ccc";
        TweenLite.to(this.containerDom, .6, {scale: .7, y: "190px", ease: Expo.easeOut });

        this.cover.style.display = "block";
        TweenLite.to(this.cover, .6, {opacity: 1 });
    }

    onCloseMenuAnimationDone(){

    }

    onTapHandler(){
        if(!AppStore.get("isMenuOpen")) return;

        AppAction.onTapMenu(this.props.name);
    }

    render() {
        var count = -1;

        return (
            <Tappable id="app-main-wrapper"
                 className={this.state.className}
                 onTap={this.onTapHandler.bind(this)}>
                <div className="content-container" >
                    <canvas id="app-canvas"></canvas>

                    <div id="app-main-dom-wrapper">
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
                        <div className="content-title-text">LISTS</div>
                    </div>
                </div>
            </Tappable>
        );
    }
}

AppContent.defaultProps = { name: "app" };

module.exports = AppContent;
