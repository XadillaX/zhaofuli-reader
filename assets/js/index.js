var gui = require('nw.gui');
require("sugar/release/sugar-full.development");
var win = gui.Window.get();
var BannerObject = require("../assets/js/util/bannerObject");
var DailySentencer = require("../assets/js/util/dailySentencer");
var FuliType = require("../assets/js/util/fuliType");
var Navbar = require("../assets/js/util/navbar");
var FuliList = require("../assets/js/util/fuliList");
var FuliPage = require("../assets/js/util/fuliPage");
var TopArticles = require("../assets/js/util/topArticles");

$(function() {
    $(".nano").nanoScroller({ tabIndex: -1 });

    initWindow();

    var bannerObject = new BannerObject(win, $);
    bannerObject.init();

    var dailySentencer = new DailySentencer(win, $);
    dailySentencer.fetch();

    var fuliType = new FuliType();
    fuliType.on("alert", function(msg, voice) { vex.dialog.alert(msg); /**$.say(voice, "zh-CN");*/ });

    var fuliList = new FuliList(win, $, fuliType);
    fuliList.init();

    var navbar = new Navbar(win, $, fuliType);
    navbar.init();

    var topArticles = new TopArticles(win, $, fuliType);
    topArticles.load();

    var fuliPage = new FuliPage(gui, win, $, fuliType);
    fuliPage.init();

    //win.showDevTools();
});
