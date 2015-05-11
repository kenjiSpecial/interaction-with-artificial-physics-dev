var AppAction = require('../../../actions/app-action');
var AppStore = require('../../../stores/app-store');

var CONSTANTS = require('../../../utils/constants');

class FooterTitle extends React.Component{
    constructor(props){
        super(props)
        this.state = {className: "title"};

        AppStore.on(CONSTANTS.OPEN_ABOUT_CONTENT, this.onOpenAbountContentHandler.bind(this));
        AppStore.on(CONSTANTS.CLOSE_ABOUT_CONTENT_START, this.onCloseAboutContentDoneHandler.bind(this));
    }

    onOpenAbountContentHandler(){
        this.setState({
            className: "title active"
        });
    }

    onClickHandler(){
        if(AppStore.get("isOpenAboutContent")) return;

        AppAction.onOpenAboutContent();

    }

    onCloseAboutContentDoneHandler(){
        this.setState({
            className : "title"
        });
    }

    render(){
        return (
            <div
                onClick={this.onClickHandler.bind(this)}
                className={this.state.className} >
                Interaction With Articial Physics
            </div>
        );
    }
}

module.exports = FooterTitle;
