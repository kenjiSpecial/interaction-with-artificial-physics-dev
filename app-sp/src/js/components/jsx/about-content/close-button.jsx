var AppStore = require('../../../stores/app-store');
var AppAction = require('../../../actions/app-action');
var CONSTANTS = require('../../../utils/constants');

class CloseButton extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            className : "close-button"
        }

        this.isClickable = false;

        AppStore.on(CONSTANTS.OPEN_ABOUT_CONTENT, this.onOpenAboutContent.bind(this));
        AppStore.on(CONSTANTS.CLOSE_ABOUT_CONTENT_DONE, this.onCloseAboutContentDone.bind(this));
    }

    onOpenAboutContent(){
        setTimeout(function(){
            this.setState({
                className: "close-button active"
            });
            this.isClickable = true;
        }.bind(this), 500)
    }

    onCloseAboutContentDone(){
        this.setState({
            className : "close-button"
        });
    }

    onClickHandler(){
        if(!this.isClickable) return;
        this.isClickable = false;

        AppAction.closeAboutContentStart();
    }

    render(){
        return (
            <div
                className={this.state.className}
                onClick={this.onClickHandler.bind(this)}
                >
                <div className="cross"></div>
            </div>
        );
    }
}

module.exports = CloseButton;
