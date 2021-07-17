const {
    dest,
    src,
    series,
    parallel,
    watch
} = require('gulp');
const pug = require('gulp-pug');
const browserSync = require("browser-sync").create();

const sass = require('gulp-dart-sass');
const bulkSass = require('gulp-sass-bulk-import');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const mergeQueries = require('postcss-merge-queries');

const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

function compileHtml() {
    return src('src/pages/**/*.pug')
        .pipe(pug({
            pretty: true,
            basedir: './src/'

        }))
        .pipe(dest('build/'));
}

function server() {
    browserSync.init({
        server: {
            baseDir: "./build/",
            ghostMode: false
        },
    });
    watch("build/").on('change', browserSync.reload);
}

function fonts() {
    return src('src/fonts/*')
        .pipe(dest('build/fonts/'));
}

function styles() {
    const plugins = [
        mergeQueries(),
        autoprefixer()
    ];
    return src('src/global/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(bulkSass())
        .pipe(sass({
            outputStyle: "expanded",
            // outputStyle: "compressed",
            allowEmpty: true
        }).on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/'));
}


function scripts() {
    return src(['src/components/**/*.js', 'src/layout/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('../'))
        .pipe(dest('build/js'));
}

function watcher() {
    watch(['src/**/*.pug', 'src/**/*.js'], compileHtml);
    watch('src/**/*.scss', styles);
    watch('src/**/*.js', scripts);

}




exports.server = parallel(server, watcher);
exports.build = parallel(compileHtml, styles, fonts);
exports.styles = series(styles);