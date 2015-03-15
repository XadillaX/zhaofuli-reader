/**
 * XadillaX created at 2015-01-26 21:50:17
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved
 */
if(typeof $ === "undefined") {
    var $, document, window;
}

var gui = require("nw.gui");
var win = gui.Window.get();
var metaGetter = require("./lib/meta/");
var boardThick;
var titleThick;

var duoshuoQuery = {
    short_name: "zflpl",
    sso: {
        login: "http:\/\/zfl520.com\/wp-login.php?action=duoshuo_login",
        logout: "http:\/\/zfl520.com\/wp-login.php?action=logout&_wpnonce=2a35f220c2"
    }
};
duoshuoQuery.sso.login += '&redirect_to=' + encodeURIComponent(window.location.href);
duoshuoQuery.sso.logout += '&redirect_to=' + encodeURIComponent(window.location.href);

function resizeBorder(w, h) {
    var trueHeight = h - titleThick - boardThick;
    $(".whole-v-border").css("height", trueHeight + "px");
    $(".bottom-border").css("width", w + "px");
    $(".main-frame").css({
        height: trueHeight + "px",
        width: (w - 2 * boardThick) + "px"
    });
}

$(function() {
    boardThick = $(".whole-v-border").width();
    titleThick = $(".whole-title-bar").height();

    resizeBorder(win.width, win.height);

    win.on("resize", function(w, h) {
        resizeBorder(w, h);
    });

    $(document).keypress(function(e) {
        if(e.ctrlKey && e.keyCode === 4) {
            win.showDevTools();
        }

        if(e.ctrlKey && e.keyCode === 18) {
            window.location.reload();
        }
    });

    metaGetter.getMeta(function(err, meta) {
        if(err) return;
        if(meta) {
            console.log("↓--------------- META ---------------↓");
            console.log(meta);
            console.log("↑--------------- META ---------------↑");
        }
    });

    win.on("new-win-policy", function(frame, url, policy) {
        policy.setNewWindowManifest({
            height: 750,
            width: 1000,
            icon: "link.png",
            frame: true
        });
    });
});
