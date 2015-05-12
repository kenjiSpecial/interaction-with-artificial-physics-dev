
class LinkText extends React.Component {
    constructor (props){
        super(props);
    }
    render(){
        return (
            <a  className="link-text"
                href={this.props.link}
                target="_blank"
                >
                <span className="base">
                    {this.props.name}
                </span>
                <span className="front">
                    {this.props.name}
                </span>
            </a>
        );
    }
}

module.exports = LinkText;

