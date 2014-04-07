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
    this.object.find("button").click(function() {
        var type = $(this).text();

        // 若还是选了这个
        if(self.type.getCurrent() === type) return;

        // 设置当前分类
        self.type.setCurrent(type);

        // UI变化
        self.object.find("button").removeClass("btn-warning");
        $(this).addClass("btn-warning");
    });
};

module.exports = Navbar;
