var ReactFlickity = React.createClass({
    componentDidMount: function() {
        if(!this.props.images || !this.props.images.length) return;
        $(this.getDOMNode()).flickity({
            imagesLoaded: true
        });
    },

    render: function() {
        return (
            <div>
            {this.props.images.map(function(img, i) {
                return (
                    <img src={img} key={"flickity" + i} />
                );
            })}
            </div>
        );
    }
});
