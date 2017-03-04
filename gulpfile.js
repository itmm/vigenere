"use strict";

var gulp = require('gulp');
var include = require('gulp-file-include');
var i18n = require('gulp-i18n-localize');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');
var rename = require('gulp-rename');
var zip = require('gulp-zip');

function dest() {
    return gulp.dest('dist');
}

gulp.task('html', function() {
    return gulp.src(['*.html', '!base.html'])
        .pipe(include())
        .pipe(i18n({
            locales: ['en', 'de'],
            localeDir: './locales',
            schema: 'suffix'
        }))
        .pipe(rename(function(path) {
            var n = path.basename;
            var i = n.lastIndexOf('-');
            path.basename = n.substring(0, i) + '_' + n.substring(i + 1);
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest());
});

gulp.task('js', function(){
    return gulp.src(['*.js', '!gulpfile.js'])
        .pipe(include())
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