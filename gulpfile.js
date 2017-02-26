var gulp = require('gulp');
var include = require('gulp-file-include');
var i18n = require('gulp-i18n-localize');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');
var zip = require('gulp-zip');
var htmlToJson = require('gulp-html-to-json');

function dest() {
    return gulp.dest('dist');
}

gulp.task('build-localization', function() {
    return gulp.src('locales/*/*_description.txt')
        .pipe(htmlToJson())
        .pipe(gulp.dest(function(file) { return file.base; }));
});

gulp.task('html', ['build-localization'], function() {
    return gulp.src(['*_web.html', '*_fragment.html'])
        .pipe(include())
        .pipe(i18n({
            locales: ['en-US', 'de-DE'],
            localeDir: './locales',
            schema: 'suffix'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest());
});

gulp.task('js', function(){
    return gulp.src(['*.js', '!gulpfile.js'])
        .pipe(uglify())
        .pipe(dest());
});

gulp.task('css', function(){
    return gulp.src('*.css')
        .pipe(minifyCSS())
        .pipe(dest());
});

gulp.task('default', [ 'html', 'js', 'css' ]);

gulp.task('dist', ['default'], function() {
    return gulp.src(['./**', '!node_modules/**', '!.idea/**', '!.git/**', '!*.zip', '!web/**'])
        .pipe(zip('vigenere.zip'))
        .pipe(gulp.dest('.'));
})

gulp.task('web', ['default'], function() {
    "use strict";
    return gulp.src(['dist/**', '!dist/*_fragment-*.html']).pipe(gulp.dest('web'));
})