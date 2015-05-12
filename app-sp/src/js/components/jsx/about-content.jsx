import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

import WorkText from "./app-contents/work-text.jsx"

var AppConstants = require('../../utils/constants');
var Tappable = require('react-tappable');

var TweenLite = require('gsap');


class AboutContent extends React.Component {
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
    }

    onLoadDoneHandler() {

    }

    componentWillMount() {
        if( AppStore.selectedClassName() == this.props.name){
            this.state.className = "content-wrapper selected";
        }
    }

    componentDidMount(){
        this.containerDom = document.getElementById("app-about-wrapper");
        this.cover = this.containerDom.querySelector(".content-title");
    }

    onBackgroundAnimationDoneHandler() {

    }

    closeMenuHandler(){
        if( AppStore.selectedClassName() == this.props.name){
            TweenLite.to(this.containerDom, .6, { y: "0px", ease: Expo.easeOut });
            TweenLite.to(this.containerDom, .5, {scale: 1, ease: Expo.easeOut, delay: .3, onComplete: this.selectedTweenComplete.bind(this)});
        }else{
            TweenLite.to(this.containerDom, .7, {scale: .7, y: window.innerHeight, ease: Expo.easeOut, onComplete: this.notSelectedTweenComplete.bind(this)})
        }

        TweenLite.to(this.cover, .5, {opacity: 0, onComplete: this.coverTweenComplete.bind(this)  });
    }

    onCloseMenuAnimationDone(){

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
        TweenLite.to(this.containerDom, .5, {scale: .7, y: "140px", ease: Expo.easeOut });

        this.cover.style.display = "block";
        TweenLite.to(this.cover, .5, {opacity: 1 });
    }

    onTapHandler(){

        if(!AppStore.get("isMenuOpen")) return;

        AppAction.onTapMenu(this.props.name)
    }

    render() {

        return (
            <Tappable id="app-about-wrapper"
                      className={this.state.className}
                      onTap={this.onTapHandler.bind(this)}>
                <div className="content-container" >
                    <div id="app-main-dom-wrapper">
                        About
                    </div>

                    <div className="content-title">
                        <div className="content-title-text">ABOUT</div>
                    </div>
                </div>
            </Tappable>
        );
    }
}


AboutContent.defaultProps = { name: "about" };

module.exports = AboutContent;
