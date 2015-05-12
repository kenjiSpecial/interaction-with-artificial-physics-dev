
import AppStore from "../../stores/app-store.js"

var Header = require('./header.jsx');
var AppContent = require('./app-content.jsx');
var ShareContent = require('./share-content.jsx');
var AboutContent = require('./about-content.jsx');
var AppConstants = require('../../utils/constants');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {display: "none", className: ""};


        AppStore.on(AppConstants.LOAD_DONE, this.onLoadDoneHandler.bind(this));
        AppStore.on(AppConstants.OPEN_MENU, this.openMenuHandler.bind(this));
    }

    onLoadDoneHandler(){
        this.setState({display: "block"});
    }

    openMenuHandler(){
        this.setState({className: "menu"})
    }

    render() {
        var display = {
            display: this.state.display,
        }

        return (
            <div id="app-wrapper" className={this.state.className} style={display}>

                <Header></Header>
                <ShareContent></ShareContent>
                <AboutContent></AboutContent>
                <AppContent></AppContent>

            </div>);
    }
}

module.exports = App;
