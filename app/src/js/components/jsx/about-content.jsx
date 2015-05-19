var TweenLite = require('gsap');
var LinkText = require('./about-content/link-text.jsx');

var CloseButton = require('./about-content/close-button.jsx');

var AppStore = require('../../stores/app-store');
var AppAction = require('../../actions/app-action');
var CONSTANTS = require('../../utils/constants');

class AboutContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {display: "none", widthRate: "0%", contents: ["title", "content", "title", "content", "content"]};
        this.originContents = ["title", "content", "title", "content", "content"];

        AppStore.on(CONSTANTS.OPEN_ABOUT_CONTENT, this.onOpenAboutContent.bind(this));
        AppStore.on(CONSTANTS.CLOSE_ABOUT_CONTENT_START, this.onCloseAboutContentStart.bind(this));
        AppStore.on(CONSTANTS.CLOSE_ABOUT_CONTENT_DONE, this.onCloseAboutContentDone.bind(this));
    }
    onOpenAboutContent(){
        this.setState({
            display: "block"
        })

        this.widthRate = 0;
        TweenLite.to(this, .8, {widthRate: 100, onUpdate: this.onUpdateTween.bind(this), ease: Expo.easeOut })
        for(var ii = 0; ii < 5; ii++){
            setTimeout(function(ii){
                if(ii == 4)     this.originContents[ii] = "content active";
                else if(ii % 2 == 0) this.originContents[ii] = "title active";
                else            this.originContents[ii] = "content active";

                this.setState({
                   contents : this.originContents
                });

            }.bind(this, ii), 50 * (ii) + 300);
        }

    }

    onCloseAboutContentStart(){
        this.widthRate = 100;
        TweenLite.to(this, .8, {widthRate: 0, onComplete: this.onCompleteClosedTween.bind(this), onUpdate: this.onUpdateTween.bind(this), ease: Expo.easeOut })
    }

    onCloseAboutContentDone(){
        this.originContents = ["title", "content", "title", "content", "content"];
        this.setState({
            contents : this.originContents
        });
    }

    onCompleteClosedTween(){
        AppAction.closeAboutContentDone();
    }

    onUpdateTween(){
        var widthRate = this.widthRate + "%"
        this.setState({
            widthRate: widthRate
        });
    }
    render(){
        var style = {
            "display" : this.state.display,
            "width"   : this.state.widthRate
        }
        return (
            <div className="about-content" style ={style} >
                <div className="about-content-wrapper">
                    <div className={this.state.contents[0]}>About</div>
                    <div className={this.state.contents[1]}>
                        <p>"Interaction with Artificial Physics" is the collction of interactinve experiments with Artificial Physics. The Artificial Physics is the system which controls the motion and coollisiton of objects by several parameters such as gravity and friction with JavaScript. Each experiment has ist own unique physics system with its unique parameter and system to add the taste artificially.</p>
                    </div>
                    <div className={this.state.contents[2]}>Thechnology behind</div>
                    <div className={this.state.contents[3]}>
                        <p>All experiments are 2D canvas made with JavaScript.</p>
                        <p>I made the physics engine for them from scratch. I read the blog, and the article, and codes about the physics engine below to make it.</p>
                        <ul>
                            <li>- <LinkText name="Matter.js" link="https://github.com/liabru/matter-js" /></li>
                            <li>- <LinkText name="Verlet.js" link="https://github.com/subprotocol/verlet-js" /></li>
                            <li>- <LinkText name="Speculative Contacts – a continuous collision engine approach" link="http://www.wildbunny.co.uk/blog/2011/03/25/speculative-contacts-an-continuous-collision-engine-approach-part-1/" /></li>
                        </ul>
                        <p>I used React, Flux, GreenSock, Babel, and didn't use any 2D canvas libary and jQuery to build this site.</p>
                    </div>
                    <div className={this.state.contents[4]}>
                        <p>Kenji SAITO has designed ande developed this site.</p>
                        <p>If you're interested in him, please chect out the below:</p>
                        <p className="contact-list">
                            <LinkText name="WebSite" link="http://kenji-special.info" />
                            <LinkText name="Twitter" link="https://twitter.com/kenji_special" />
                            <LinkText name="GitHub" link="https://github.com/kenjiSpecial" />
                            <LinkText name="E-mail" link="mailto:k.saito.1985@gmail.com" />
                        </p>
                    </div>
                </div>
                <CloseButton></CloseButton>

            </div>
        );
    }
}

module.exports = AboutContent
