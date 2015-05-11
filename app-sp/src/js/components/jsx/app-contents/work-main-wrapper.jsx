import WorkText from "./work-text.jsx"
import WorkBall from "./work-ball.jsx"

class WorkMainWrapper extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){

        var initName = this.props.name.charAt(0);
        var workId = "work-" + this.props.number;
        var workTextId = "work-text-" + this.props.number;
        var workBallId = "work-ball-" + this.props.number;

        return(
           <div className="work-main-wrapper" id={workId}>
               <WorkText key={workId} name={this.props.name} number={this.props.number} ></WorkText>
               <WorkBall key={workBallId} name={initName} number={this.props.number} ></WorkBall>
           </div>
        );
    }
}

module.exports = WorkMainWrapper;
