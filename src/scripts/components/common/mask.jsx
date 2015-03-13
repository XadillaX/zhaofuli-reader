var LoadingMask = React.createClass({
    componentDidMount: function() {
        var maskDOM = React.findDOMNode(this.refs.mask);
        this.mask = $(maskDOM).loadingMask();
    },

    show: function() {
        this.mask.show();
    },

    hide: function() {
        this.mask.hide();
    },

    toggle: function() {
        this.mask.toggle();
    },

    render: function() {
        return (<div ref="mask">{this.props.inner || ""}</div>);
    }
});
