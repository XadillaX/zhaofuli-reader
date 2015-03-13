var ProgressBar = React.createClass({
    getPercent: function() {
        if(!this.state || undefined === this.state.percent) {
            return this.props.percent;
        } else {
            return this.state.percent;
        }
    },

    setPercent: function(percent) {
        this.setState({ percent: percent });
    },

    render: function() {
        var style = {
            width: this.getPercent() + "%"
        };

        var className = "progress-bar progress-bar-striped";
        if(!this.props.noActive) className += " active";
        if(this.props.style) {
            className += " progress-bar-" + this.props.style;
        }

        return (
            <div className="progress">
                <div className={className} role="progressbar" aria-valuenow="{this.getPercent()}"
                    aria-valuemin="0" aria-valuemax="100" style={style}>
                </div>
            </div>
        );
    }
});
