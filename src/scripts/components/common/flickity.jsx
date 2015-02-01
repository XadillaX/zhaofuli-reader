var ReactFlickity = React.createClass({
    componentDidMount: function() {
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
