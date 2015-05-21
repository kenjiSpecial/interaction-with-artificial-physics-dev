import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

import WorkText from "./app-contents/work-text.jsx"

var AppConstants = require('../../utils/constants');
var SNSText = require('./sns-texts/sns.jsx');
var Tappable = require('react-tappable');

class ShareContent extends React.Component {
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
        this.containerDom = document.getElementById("app-share-wrapper");
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
        TweenLite.to(this.containerDom, .6, {scale: .7, y: "80px",ease: Expo.easeOut  });

        this.cover.style.display = "block";
        TweenLite.to(this.cover, .6, {opacity: 1});
    }

    onCloseMenuAnimationDone(){

    }

    onTapHandler(){
        if(!AppStore.get("isMenuOpen")) return;

        AppAction.onTapMenu(this.props.name, this.props.name);
    }

    render() {

        return (
            <Tappable id="app-share-wrapper"
                      className={this.state.className}
                      onTap={this.onTapHandler.bind(this)}>
                <div className="content-container">
                    <div id="app-share-dom-wrapper">
                        <ul className="share-buttons">
                            <li><SNSText name="Facebook" title="Share on Facebook" onClick="window.open(this.href, 'FBwindow', 'width=650, height=450, menubar=no, toolbar=no, scrollbars=yes'); return false; " href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F2d-phy.kenji-special.info%2F&t=Interaction%20With%20Artificial%20Physics" ></SNSText></li>
                            <li><SNSText name="Twitter" title="Tweet" href="https://twitter.com/intent/tweet?source=http%3A%2F%2F2d-phy.kenji-special.info%2F&text=Interaction%20With%20Artificial%20Physics:%20http%3A%2F%2F2d-phy.kenji-special.info%2F&via=kenji_special" onClick="window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + ':%20'  + encodeURIComponent(document.URL)); return false;" ></SNSText></li>
                            <li><SNSText name="Google+" title="Share on Google+" href="https://plus.google.com/share?url=http%3A%2F%2F2d-phy.kenji-special.info%2F" onClick="window.open('https://plus.google.com/share?url=' + encodeURIComponent(document.URL)); return false;"></SNSText></li>
                            <li><SNSText name="Tumblr" title="Post to Tumblr" href="http://www.tumblr.com/share?v=3&u=http%3A%2F%2F2d-phy.kenji-special.info%2F&t=Interaction%20With%20Artificial%20Physics&s=" onclick="window.open('http://www.tumblr.com/share?v=3&u=' + encodeURIComponent(document.URL) + '&t=' +  encodeURIComponent(document.title)); return false;"></SNSText></li>
                            <li><SNSText name="Pinterest" title="Pin it" href="http://pinterest.com/pin/create/button/?url=http%3A%2F%2F2d-phy.kenji-special.info%2F&description=Interaction%20With%20Artificial%20Physics%20is%20a%20collection%20of%20interactive%20experiments%20With%20artificial%20physics.&media=http%3A%2F%2F2d-phy.kenji-special.info/images/og.png" onclick="window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(document.URL) + '&description=' +  encodeURIComponent(document.title)); return false;"></SNSText></li>
                            <li><SNSText name="Pocket" title="Add to Pocket" href="https://getpocket.com/save?url=http%3A%2F%2F2d-phy.kenji-special.info%2F&title=Interaction%20With%20Artificial%20Physics" onclick="window.open('https://getpocket.com/save?url=' + encodeURIComponent(document.URL) + '&title=' +  encodeURIComponent(document.title)); return false;"></SNSText></li>
                        </ul>
                    </div>

                    <div className="content-title">
                        <div className="content-title-text">SHARE</div>
                    </div>
                </div>


            </Tappable>
        );
    }
}


ShareContent.defaultProps = { name: "share" };

module.exports = ShareContent;
