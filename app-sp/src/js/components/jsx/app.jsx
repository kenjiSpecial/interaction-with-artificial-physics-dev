
import AppStore from "../../stores/app-store.js"

var Header = require('./header.jsx');
var AppContent = require('./app-content.jsx');
var BottomContent = require('./bottom-content.jsx');
var ShareContent = require('./share-content.jsx');
var AboutContent = require('./about-content.jsx');
var AppConstants = require('../../utils/constants');


var Tappable = require('react-tappable');



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {display: "none", className: ""};


        AppStore.on(AppConstants.LOAD_DONE, this.onLoadDoneHandler.bind(this));
        AppStore.on(AppConstants.OPEN_MENU, this.openMenuHandler.bind(this));
        //menuAnimationDone
        AppStore.on(AppConstants.CLOSE_MENU_ANIMATION_DONE, this.onCloseMenuAnimationDone.bind(this));
    }

    onLoadDoneHandler(){
        this.setState({display: "block"});
    }

    openMenuHandler(){
        this.setState({className: "menu"})
    }

    onCloseMenuAnimationDone(){
        this.setState({className: ""})
    }

    render() {
        var display = {
            display: this.state.display,
        }

        return (
            <div id="app-wrapper" className={this.state.className} style={display}>

                <Header></Header>
                <BottomContent></BottomContent>
                <ShareContent></ShareContent>
                <AboutContent></AboutContent>
                <AppContent></AppContent>

            </div>);
    }
}

module.exports = App;
