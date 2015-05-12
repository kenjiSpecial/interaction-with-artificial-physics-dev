var Tappable = require('react-tappable');

import AppStore from "../../stores/app-store.js"
import AppData  from "../../data/app-data.js"
import AppAction from "../../actions/app-action.js"

class BottomContent extends React.Component {
    constructor(props) {
        super(props);

    }

    onTapHandler(){
        if(!AppStore.get("isMenuOpen") || AppStore.get("isMenuAnimation")) return;

        AppAction.onTapBottomContent();
    }

    render(){
        return (
            <Tappable
                id="bottom-content"
                onTap={this.onTapHandler.bind(this)} />
        )
    }
}

module.exports = BottomContent;

