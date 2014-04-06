var $ = null;

var BannerObject = function(win, jquery) {
    $ = jquery;

    this.win = win;
    this.object = $("#banner-object");
    this.width = 0;
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
        left = (this.width - 1024) / 2;
        this.object.css("background-position-x", left + "px");
    } else {
        this.object.css("background-position-x", "0px");
    }
};

module.exports = BannerObject;
