var gulp = require('gulp');
var include = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');

gulp.task('html', function() {
    return gulp.src('*_web.html')
        .pipe(include())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('fragment', function() {
    return gulp.src('*_fragment.html')
        .pipe(include())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function(){
    return gulp.src('*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function(){
    return gulp.src('*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'html', 'fragment', 'js', 'css' ]);
