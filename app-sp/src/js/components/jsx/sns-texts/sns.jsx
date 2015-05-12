
class FacebookText extends React.Component {
    constructor(props){
        super(props)
        this.state = {className : ""}
    }

    onMouseEnter(){
        this.setState({
            className: "hover"
        });
    }

    onMouseLeave(){

        this.setState({
            className: ""
        });
    }

    render(){
        return (
            <a
                className = {this.state.className}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                href={this.props.href}
                title={this.props.title}
                target="_blank"
                onclick={this.props.onClick}>
                <div className="bot">{this.props.name}</div>
            </a>
        );
    }
}

module.exports = FacebookText;
