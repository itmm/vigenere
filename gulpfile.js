"use strict";

var gulp = require('gulp');
var include = require('gulp-file-include');
var i18n = require('gulp-i18n-localize');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');
var mocha = require('gulp-mocha');
var zip = require('gulp-zip');

function dest() {
    return gulp.dest('dist');
}

gulp.task('html', function() {
    return gulp.src(['src/*/*.html', '!src/common/**', '!src/test/**'])
        .pipe(include())
        .pipe(i18n({
            locales: ['en', 'de'],
            localeDir: './locales',
            schema: 'suffix'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest());
});

gulp.task('js', function(){
    return gulp.src(['src/*/*.js', '!src/common/**', '!src/test/**'])
        .pipe(include())
        .pipe(uglify())
        .pipe(dest());
});

gulp.task('css', function(){
    return gulp.src(['src/*/*.css', '!src/common/**', '!src/test/**'])
        .pipe(include())
        .pipe(minifyCSS())
        .pipe(dest());
});

gulp.task('build-tests', function() {
    return gulp.src('src/test/*.js')
        .pipe(include())
        .pipe(gulp.dest('dist-test'));
});

gulp.task('test', ['build-tests'], function() {
    return gulp.src('dist-test/*.js')
        .pipe(mocha());
});

gulp.task('default', [ 'test', 'html', 'js', 'css' ]);

gulp.task('dist', ['default'], function() {
    return gulp.src(['./**', '!node_modules/**', '!.idea/**', '!.git/**', '!*.zip', '!web/**', '!dist-test/**'])
        .pipe(zip('vigenere.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('web', ['default'], function() {
    return gulp.src(['dist/**', '!dist/*.html', 'dist/*_web.html']).pipe(gulp.dest('web'));
});

