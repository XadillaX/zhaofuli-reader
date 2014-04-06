/**
 * Created by XadillaX on 14-1-28.
 */
var gui = require('nw.gui');

$(function() {
    /**
     * 找福利 - logo
     */
    $(".navbar-brand").click(function() {
        gui.Window.open("http://www.zhaofuli.net/", {
            position: "center",
            width: 800,
            height: 600,

            title: "找福利浏览器",
            toolbar: false
        });
    });
});
