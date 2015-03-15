"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")({
    rename: { "minify-html": "minifyHtml" }
});
var del = require("del");

gulp.task("lib", function() {
	return gulp.src("src/lib/**/*")
		.pipe(gulp.dest("dist/lib"))
		.pipe($.size());
});

// bootstrap font
gulp.task("bsFont", function() {
    gulp.src(
        "src/bower_components/bootstrap/dist/**/*.{eot,svg,ttf,woff,woff2}",
        { base: "src/bower_components/bootstrap/dist" })
        .pipe(gulp.dest("dist"));
});

gulp.task("mask", function() {
    gulp.src(
        "src/bower_components/jloadingmask/theme/default/*.png",
        { base: "src/bower_components/jloadingmask/theme/default" })
        .pipe(gulp.dest("dist/css"));
});

// bower
gulp.task("bower", [ "bsFont", "mask" ], function() {
    return gulp.src(
        "src/bower_components/**/*.{js,css,png,eot,svg,ttf,woff,woff2}",
        { base: "src/bower_components" })
        .pipe(gulp.dest("dist/bower_components"));
});

// view
gulp.task("view", function() {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("dist"))
        .pipe($.size());
});

// stylus
gulp.task("styl", function() {
    return gulp.src("src/styles/**/*.{styl,css}")
        .pipe($.if("*.styl", $.stylus()))
        .pipe($.autoprefixer("last 1 version"))
        .pipe(gulp.dest("dist/styles"))
        .pipe($.size());
});

// font
gulp.task("font", function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe($.size());
});

// move images
gulp.task("image", function() {
    return gulp.src("src/images/**/*")
        .pipe(gulp.dest("dist/images"))
        .pipe($.size());
});

// move js scripts
gulp.task("script", function() {
    return gulp.src("src/scripts/**/*.js")
        .pipe(gulp.dest("dist/scripts"))
        .pipe($.size());
});

// move jsx files
gulp.task("jsx", function() {
    return gulp.src("src/scripts/components/**/*.jsx")
        .pipe(gulp.dest("dist/scripts"))
        .pipe($.size());
});

// a bundle of tasks
gulp.task("bundle", [ "bower", "view", "styl", "script", "jsx", "font", "image", "lib" ]);
gulp.task("bundleBuild", [ "bower", "view", "styl", "script", "jsxToJs", "font", "image", "lib" ]);

gulp.task("jsxToJs", function() {
    return gulp.src("src/scripts/components/**/*.jsx")
        .pipe($.react())
        .pipe($.rename(function(p) {
            p.extname = ".jsx";
        }))
        .pipe(gulp.dest("dist/scripts"))
        .pipe($.size());
});

// compress scripts
gulp.task("compressScript", [ "bundleBuild" ], function() {
    var assets = $.useref.assets();
    return gulp.src("dist/**/*.html")
        .pipe(assets)
        .pipe($.if("*.js", $.uglify()))
        .pipe($.if("*.css", $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest("dist/"))
        .pipe($.size())
        .on("error", $.util.log);
});

// compress
gulp.task("compress", [ "compressScript" ], function() {
    return gulp.src("dist/**/*.html")
        .pipe($.minifyHtml({ spare: true }))
        .pipe(gulp.dest("dist/"))
        .pipe($.size())
        .on("error", $.util.log);
});

// build the project
gulp.task("build", [ "compressScript" ], function() {
    var dirs = [
        __dirname + "/dist/bower_components",
        __dirname + "/dist/scripts",
        __dirname + "/dist/styles"
    ];

    // clean useless things
    del.sync(__dirname + "/dist/bower_components");
});

// watch
gulp.task("watch", [ "bundle" ], function() {
    gulp.watch("src/**/*.html", [ "view" ]);
    gulp.watch("src/styles/**/*.{styl,css}", [ "styl" ]);
    gulp.watch("src/scripts/**/*.js", [ "script" ]);
    gulp.watch("src/scripts/components/**/*.jsx", [ "jsx" ]);
    gulp.watch("src/lib/**/*", [ "lib" ]);
    gulp.watch("src/images/**/*", [ "image" ]);
});

// set default task to `watch`
gulp.task("default", [ "watch" ]);

