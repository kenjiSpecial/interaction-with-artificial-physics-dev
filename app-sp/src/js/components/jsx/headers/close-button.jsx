var Tappable = require('react-tappable');

var AppStore = require('../../../stores/app-store');
var AppAction = require('../../../actions/app-action');

var AppConstants = require('../../../utils/constants');

class CloseButton extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            className : "close-button-wrapper"
        }

        AppStore.on(AppConstants.TAP_MENU, this.onTapMenu.bind(this));
    }

    onClickHandler(){
        if(AppStore.get("isMenuAnimation")) return;

        var className = ["close-button-wrapper"];

        if(AppStore.isMenuOpen()){
            AppAction.closeMenu();
            setTimeout(function(){
                AppAction.closeAnimationDone();
            }, 700)
        }else{
            className.push("open");
            AppAction.openMenu();
            setTimeout(function(){
                AppAction.menuAnimationDone();
            }, 700);
        }

        var classNameString = className.join(" ");

        this.setState({
            className: classNameString
        });
    }

    onTapMenu () {

        setTimeout(function(){
            AppAction.closeAnimationDone();
        }, 700)

        this.setState({
            className: "close-button-wrapper"
        });
    }

    render(){

        return(
            <Tappable className={this.state.className} onTap={this.onClickHandler.bind(this)}>

                <div className="close-button">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </Tappable>
        );
    }
}

module.exports = CloseButton;
