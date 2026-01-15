const { src, dest, series, parallel, watch } = require("gulp");
const plumber = require("gulp-plumber");
const fileinclude = require("gulp-file-include");
const webserver = require("gulp-webserver");
const connect = require("gulp-connect");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const beautify = require("gulp-beautify");
const htmlbeautify = require("gulp-html-beautify");
const cssbeautify = require("gulp-cssbeautify"); 

// SCSS
function scssTask() {
  return src("./src/assets/css/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(
      cssbeautify({
        indent: "  ",
        autosemicolon: true,
        openbrace: "end-of-line",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/assets/css/"))
    .pipe(connect.reload());
}

// JS Beautify
function beautifyTask() {
  return src("./src/assets/js/*.js")
    .pipe(plumber())
    .pipe(beautify.js({ indent_size: 2 }))
    .pipe(dest("./dist/assets/js/"))
    .pipe(connect.reload());
}

// File include + HTML beautify
function fileincludeTask() {
  return src("./src/**/*.html", { base: "./src/" })
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlbeautify({ indent_with_tabs: true }))
    .pipe(dest("./dist/"))
    .pipe(connect.reload());
}

// HTML beautify only (선택 기능)
function htmlbeautifyTask() {
  return src("./src/**/*.html")
    .pipe(plumber())
    .pipe(htmlbeautify({ indent_with_tabs: true }))
    .pipe(dest("./dist/"));
}

// Dev server (자동 새로고침 포함)
function connectTask() {
  return connect.server({
    root: "dist",
    port: 8001,
    livereload: true,
  });
}

// Watch
function watchTask() {
  watch(["./src/**/*.html"], series(fileincludeTask));
  watch("./src/assets/css/**/*.scss", series(scssTask));
  watch("./src/assets/js/*.js", series(beautifyTask));
}

// Default
exports.default = series(parallel(scssTask, fileincludeTask, beautifyTask), parallel(watchTask));

// 개별 실행
exports.scss = scssTask;
exports.fileinclude = fileincludeTask;
exports.beautify = beautifyTask;
exports.htmlbeautify = htmlbeautifyTask;
exports.watch = watchTask;
exports.connect = connectTask;
