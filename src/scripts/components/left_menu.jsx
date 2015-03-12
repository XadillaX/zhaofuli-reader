$(function() {
    var gui = require("nw.gui");
    var reactLib = require("./lib/react");
    var metaGetter = require("./lib/meta");
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
            metaGetter.getCategories(function(err, types) {
                if(err) {
                    // sweetAlert("啊吖吖", err.message, "error");
                    self.setState({ types: [ { name: "获取失败，请重试", url: "$RETRY$" } ] });
                    return;
                }
                
                self.setState({ types: types });
            });
        },
        
        handleClick: function(idx) {
            var self = this;
            if(this.state.types[idx].active) return;
            var wrapper = reactLib.getComponent("ItemListWrapper");
            if(!wrapper) return;

            if(this.state.types[idx].url === "$RETRY$") {
                this.setState({ types: [] });
                return this.componentDidMount();
            }

            if(this.state.types[idx].extra) {
                return gui.Shell.openExternal(this.state.types[idx].url);
            }

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

            wrapper.selectCat(this.state.types[idx].id, 1);
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
                                id={type.id}
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
