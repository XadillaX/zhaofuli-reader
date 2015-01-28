$(function() {
    var reactLib = require("./lib/react");
    var typeGetter = require("./lib/type/getter");
    var LeftMenuPiece;
    var LeftMenu;

    LeftMenuPiece = React.createClass({
        render: function() {
            return (
                <li onClick={this.props.onClick} className={this.props.active ? "active" : ""}>
                    <a href="#">
                        {this.props.name}
                    </a>
                </li>
            );
        }
    });

    LeftMenu = React.createClass({
        getInitialState: function() {
            reactLib.addComponent("LeftMenu", this);
            return { types: [] };
        },
        
        componentDidMount: function() {
            var self = this;
            typeGetter.get(function(err, types) {
                if(err) {
                    // TODO...
                    return;
                }
                
                self.setState({ types: types });
            });
        },
        
        handleClick: function(idx) {
            var self = this;
            this.setState({
                types: self.state.types.map(function(n, i) {
                    if(i !== idx) delete n.active;
                    else {
                        n.active = true;
                        console.log(n.name + " is selected.");
                    }
                    return n;
                })
            });
        },
        
        render: function() {
            if(!this.state.types.length) {
                return (
                    <div className="left-menu-loading"></div>
                );
            } else {
                var self = this;
                return (
                    <ul className="nav nav-pills nav-stacked">
                        {this.state.types.map(function(type, i) {
                            var handleClick = self.handleClick.bind(self, i);
                            return (
                            <LeftMenuPiece
                                key={"types-" + i}
                                onClick={handleClick}
                                active={type.active}
                                name={type.name}
                                url={type.url}
                            />
                            );
                        })}
                    </ul>
                );
            }
        }
    });

    React.render(
        <LeftMenu />,
        document.getElementById("rct-left-menu")
    );
});

