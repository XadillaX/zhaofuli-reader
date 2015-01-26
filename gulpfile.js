"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")({
    rename: { "minify-html": "minifyHtml" }
});
var fs = require("fs");

// bower
gulp.task("bower", function() {
    gulp.src(
        "src/bower_components/**/*.{js,css,eot,svg,ttf,woff,woff2}",
        { base: "src/bower_components" })
        .pipe(gulp.dest("dist/bower_components"));
});

// view
gulp.task("view", function() {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("dist"))
        .pipe($.size());
});

// a bundle of tasks
gulp.task("bundle", [ "bower", "view" ]);

// clean
gulp.task("clean", function() {
    var dirs = [ "dist/scripts", "dist/styles", "dist/images" ];
    for(var i = 0; i < dirs.length; i++) {
        try {
            fs.rmdirSync(__dirname + "/" + dirs[i]);
        } catch(e) {
            //...
        }
    }
});

// compress
gulp.task("compress", [ "bundle" ], function() {
    var assets = $.useref.assets();
    return gulp.src("dist/**/*.html")
        .pipe(assets)
        .pipe($.if("*.js", $.uglify()))
        .pipe($.if("*.css", $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.minifyHtml({ comments: true, spare: true }))
        .pipe(gulp.dest("dist/"))
        .pipe($.size())
        .on("error", $.util.log);
});

// watch
gulp.task("watch", [ "bundle" ], function() {
});

// build the project
gulp.task("build", [ "clean", "compress" ]);

// set default task to `watch`
gulp.task("default", [ "watch" ]);
gulp.task("brackets-default", [ "build" ]);
