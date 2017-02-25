var gulp = require('gulp');
var include = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');

gulp.task('html', function() {
    return gulp.src('vigenere_web.html')
        .pipe(include())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('fragment', function() {
    return gulp.src('vigenere_fragment.html')
        .pipe(include())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function(){
    return gulp.src('vigenere.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function(){
    return gulp.src('vigenere.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'html', 'fragment', 'js', 'css' ]);
