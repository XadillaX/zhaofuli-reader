/**
 * Created by XadillaX on 2014/4/7.
 */
var $ = null;
var events = require("events");

/**
 * 导航栏
 * @param win
 * @param jquery
 * @param fuliType
 * @param fuliList
 * @constructor
 */
var Navbar = function(win, jquery, fuliType, fuliList) {
    $ = jquery;
    this.win = win;
    this.object = $("#nav");
    this.type = fuliType;
    this.type.setCurrent("全部");
    this.list = fuliList;
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
        if(self.type.getCurrent() === type) {
            self.type.emit("hidePage");
            self.type.emit("showList");
            return;
        }

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
            $('.information-page-left').addClass("top-articles-fixed");
        } else {
            $("#top-articles").removeClass("top-articles-fixed");
            $('.information-page-left').removeClass("top-articles-fixed");
        }

        // Banner条的透明度
        var maxDown = 300;
        if(values.position >= maxDown) {
            $("#banner-object").stop().fadeTo("normal", 0);
        } else {
            var opacity = 1 - (values.position / maxDown);
            $("#banner-object").stop().fadeTo("normal", opacity);
        }

        // 记录当下滚动位置
        self.type.emit("updateScrollbarPosition", values.position, values.maximum);

        // 滚动条滚动到底部了，那么要下拉刷新
        if(values.position + 20 >= values.maximum) {
            var showState = $("#list-container").parent().css("display");
            if(showState === "none") {
                return;
            }

            // 当前类型以及是否在载入...
            var current = self.type.getCurrent();
            var cache = self.list.fuliCache[current];
            if(!cache || cache.loading) {
                return;
            }

            // 显示loading
            cache.showProgress();

            // 当前类型载入更多
            self.list.loadMore(current);
        }
    });
};

module.exports = Navbar;
