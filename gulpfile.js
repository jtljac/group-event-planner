const gulp = require("gulp");
const less = require('gulp-less');
const path = require('path');

const src = "./src/";
const dest = "./server/";

function compileLess() {
    return gulp.src(src + 'less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(dest + 'public/css'));
}

function build() {

}

function watch() {
    gulp.watch([src + "less/**/*.less"], compileLess);
}

exports.compileLess = compileLess;
exports.watch = gulp.series(compileLess, watch);