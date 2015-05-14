import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

import WorkText from "./app-contents/work-text.jsx"

var AppConstants = require('../../utils/constants');
var Tappable = require('react-tappable');
var LinkText = require('./about-content/link-text.jsx');


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
        this.containerDom = document.getElementById("app-about-wrapper");
        this.cover = this.containerDom.querySelector(".content-title");

        TweenLite.set(this.containerDom, {y: window.innerHeight});
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
        TweenLite.to(this.containerDom, .6, {scale: .7, y: "135px", ease: Expo.easeOut });

        this.cover.style.display = "block";

        TweenLite.to(this.cover, .6, {opacity: 1 });
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
                    <div id="app-about-dom-wrapper">
                        <p className="title">About</p>
                        <div className="content">
                            <p>"Interaction with Artificial Physics" is the collction of interactinve experiments with Artificial Physics. The Artificial Physics is the system which controls the motion and coollisiton of objects by several parameters such as gravity and friction with JavaScript. Each experiment has ist own unique physics with its unique parameter and system to add the taste artificially.</p>
                        </div>
                        <p className="title">Thechnology behind</p>
                        <div className="content">
                            <p>All experiments are 2D canvas made with JavaScript.</p>
                            <p>I made the physics engine for them from scratch. I read the blog, and the article, and codes about the physics engine below to make it.</p>
                            <ul>
                                <li>- <a href="https://github.com/liabru/matter-js" target="_blank">Matter.js</a></li>
                                <li>- <a href="https://github.com/subprotocol/verlet-js" target="_blank">Verlet.js</a></li>
                                <li>- <a href="http://www.wildbunny.co.uk/blog/2011/03/25/speculative-contacts-an-continuous-collision-engine-approach-part-1/" target="_blank">Speculative Contacts</a></li>
                            </ul>
                            <p>I used React, Flux, GreenSock, and didn't use any 2D canvas libary and jQuery to build this site.</p>
                        </div>
                        <div className="content">
                            <p>If you're interested in me, please chect out the below:</p>
                            <p className="contact-list">
                                <a href="http://kenji-special.info" target="_blank" >WebSite</a>
                                <a href="https://twitter.com/kenji_special" target="_blank" >Twitter</a>
                                <a href="https://github.com/kenjiSpecial" target="_blank" >GitHub</a>
                                <a href="mailto:k.saito.1985@gmail.com">E-mail</a>
                            </p>
                        </div>

                        <div className="content">
                            <p>Thank you for experience my experiments. Designed and Developed By <a href="http://kenji-special.info" target="_blank" >Kenji SAITO</a>.</p>
                        </div>
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
