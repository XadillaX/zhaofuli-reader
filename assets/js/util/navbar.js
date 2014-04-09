/**
 * Created by XadillaX on 2014/4/7.
 */
var $ = null;
var events = require("events");

/**
 * 导航栏
 * @param win
 * @param jquery
 * @constructor
 */
var Navbar = function(win, jquery, fuliType) {
    $ = jquery;
    this.win = win;
    this.object = $("#nav");
    this.type = fuliType;
    this.type.setCurrent("全部");
};

/**
 * 初始化导航栏
 */
Navbar.prototype.init = function() {
    var self = this;

    // 按了按钮就导航过去
    this.object.find("a").click(function() {
        var type = $(this).text();

        // 若还是选了这个
        if(self.type.getCurrent() === type) return;

        // 设置当前分类
        self.type.setCurrent(type);

        // UI变化
        self.object.find("a").removeClass("btn-warning");
        $(this).addClass("btn-warning");
        $(".nano").nanoScroller();
    });

    // 滚动条滚动
    $(".nano").on("update", function(event, values){
        if(values.position > 110) {
            // 固定navbar
            $("#nav").addClass("nav-fixed");
            $("#nav .btn-group").addClass("btn-group-justified");
        } else {
            // 恢复navbar
            $("#nav").removeClass("nav-fixed");
            $("#nav .btn-group").removeClass("btn-group-justified");
        }

        if(values.position > 160) {
            $("#top-articles").addClass("top-articles-fixed");
        } else {
            $("#top-articles").removeClass("top-articles-fixed");
        }

        // Banner条的透明度
        var maxDown = 300;
        if(values.position >= maxDown) {
            $("#banner-object").stop().fadeTo("normal", 0);
        } else {
            var opacity = 1 - (values.position / maxDown);
            $("#banner-object").stop().fadeTo("normal", opacity);
        }
    });
};

module.exports = Navbar;
