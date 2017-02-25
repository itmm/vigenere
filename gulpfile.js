var gulp = require('gulp');
var rename = require('gulp-rename');
var include = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(include())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('fragment', function() {
    return gulp.src('vigenere.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename('fragment.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function(){
    return gulp.src('vigenere.js')
        .pipe(uglify())
        .pipe(rename('build.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function(){
    return gulp.src('vigenere.css')
        .pipe(minifyCSS())
        .pipe(rename('build.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'html', 'fragment', 'js', 'css' ]);
