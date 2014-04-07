/**
 * Created by XadillaX on 2014/4/7.
 */
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
