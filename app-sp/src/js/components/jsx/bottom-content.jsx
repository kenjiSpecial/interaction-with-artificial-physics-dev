var Tappable = require('react-tappable');

import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

var CONSTANTS = require('../../utils/constants');

class BottomContent extends React.Component {
    constructor(props) {
        super(props);

        AppStore.on(CONSTANTS.OPEN_MENU, this.onOpenMenuHandler.bind(this));
        AppStore.on(CONSTANTS.CLOSE_MENU, this.onCloseMenuHandler.bind(this));

        this.state = {display: "none"}
    }

    onOpenMenuHandler() {
        this.setState({
            display : "block"
        });
    }

    onCloseMenuHandler(){
        this.setState({
            display : "none"
        });
    }

    onTapHandler(){
        if(!AppStore.get("isMenuOpen") || AppStore.get("isMenuAnimation")) return;

        AppAction.onTapBottomContent();
    }

    render(){
        var style = {
            display : this.state.display
        }
        return (
            <Tappable
                style={style}
                id="bottom-content"
                onTap={this.onTapHandler.bind(this)} />
        )
    }
}

module.exports = BottomContent;

