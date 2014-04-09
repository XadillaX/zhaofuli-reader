var $ = null;

var BannerObject = function(win, jquery) {
    $ = jquery;

    this.win = win;
    this.object = $("#banner-object");
    this.width = 0;

    setInterval(this.reposition.bind(this), 500);
};

BannerObject.prototype.init = function() {
    var self = this;
    this.reposition();

    this.win.on("resize", function() {
        self.reposition();
    })
};

BannerObject.prototype.reposition = function() {
    // 获取窗口宽度
    var width = window.innerWidth;

    if(width < 1024) {
        this.width = width;
        this.object.css("width", width + "px");
    } else {
        this.width = 1024;
        this.object.css("width", "1024px");
    }

    var left = (width - this.width) / 2;

    this.object.css("left", left + "px");

    // 背景图片位置
    if(this.width < 1024) {
        this.object.css("background-position-x", ((this.width - 1024) / 2) + "px");
    } else {
        this.object.css("background-position-x", "0px");
    }

    // body长度
    var height = window.innerHeight;
    height -= 45;
    $(".nano").css("height", height + "px");
    $(".nano").nanoScroller({ tabIndex: -1 });

    // navbar 位置
    $("#nav").css("left", $("#list-container-wrapper").offset().left + "px");
    // 右边置顶宽度
    $("#top-articles .panel").css("width", $("#top-articles").parent().width() + "px");
};

module.exports = BannerObject;
