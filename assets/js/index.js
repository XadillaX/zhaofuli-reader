var gui = require('nw.gui');
var win = gui.Window.get();

function initWindow() {
    $(".title-operators > .minimize").click(function() {
        win.minimize();
    });
    $(".title-operators > .maximize").click(function() {
        win.maximize();
    });
    $(".title-operators > .restore").click(function() {
        win.restore();
    });
    $(".title-operators > .close-btn").click(function() {
        win.close();
    });

    win.on("maximize", function() {
        $(".title-operators > .maximize").css("display", "none");
        $(".title-operators > .restore").css("display", "inline-block");
    });
    win.on("unmaximize", function() {
        $(".title-operators > .maximize").css("display", "inline-block");
        $(".title-operators > .restore").css("display", "none");
    });
}

var BannerObject = require("../assets/js/util/bannerObject");
var DailySentencer = require("../assets/js/util/dailySentencer");

$(function() {
    initWindow();

    var bannerObject = new BannerObject(win, $);
    bannerObject.init();

    var dailySentencer = new DailySentencer(win, $);
    dailySentencer.fetch();
});
