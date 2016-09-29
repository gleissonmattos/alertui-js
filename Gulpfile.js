'use strict';

var appName = 'mxnavtab';

//Gulp imports
var gulp           = require('gulp')
	, pug            = require('gulp-pug')
  , htmlBeautify   = require('gulp-html-beautify')
  , cssBeautify    = require('gulp-cssbeautify')
  , cssMin         = require('gulp-minify-css')
	, sass           = require('gulp-sass')
  , rename         = require('gulp-rename')
  , jsBeautify     = require('gulp-jsbeautify')
  , jsMin          = require('gulp-jsmin');

gulp.task('default', ['sass', 'pug', 'js']);

var pugFile = './src/pug/*.pug';
var pugDirt = './example';

//Pug to html
gulp.task('pug', function buildHTML(){
    return gulp.src(pugFile)
        .pipe(pug({
          'locals' : [pugDirt]
        }))
        .pipe(htmlBeautify({
            'indent_size' : 1,
            'indent_char' : " ",
            'indent_with_tabs' : false,
            'wrap_line_length' : 0
        }))
        .pipe(htmlBeautify())
        .pipe(gulp.dest(pugDirt));
});

var scriptFile = './src/scripts/*.js';
var scriptDirt = './dist/assets/js';

//js to final .js
gulp.task('js', function () {
    return gulp.src(scriptFile)
        .pipe(jsBeautify({indentSize: 4}))
        .pipe(gulp.dest(scriptDirt))
        .pipe(jsMin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(scriptDirt));
});


var scssFile = './src/scss/*.scss';
var cssDist = './dist/assets/css';

//scss/sass to .css 
gulp.task('sass', function () {
    return gulp.src(scssFile)
        .pipe(sass().on('error', sass.logError))
        .pipe(cssBeautify())
        .pipe(gulp.dest(cssDist))
        .pipe(cssMin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(cssDist));
});

//default task
gulp.task('default', function(){
    gulp.watch(scssFile, ['sass']);
    gulp.watch(pugFile, ['pug']);
    gulp.watch(scriptFile, ['js']);
});