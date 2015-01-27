$(function() {
    var typeGetter = require("./lib/type/getter");

    var LeftMenuPiece = React.createClass({
        render: function() {
            return (
                <li className={this.props.active ? "active" : ""}><a href="#">{this.props.name}</a></li>
            );
        }
    });

    var LeftMenu = React.createClass({
        getInitialState: function() {
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
            alert("1");
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
                                <LeftMenuPiece key={"types-" + i} onClick={handleClick} active={type.active} name={type.name} url={type.url} />
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
