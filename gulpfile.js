var gulp = require('gulp');
var include = require('gulp-file-include');
var i18n = require('gulp-i18n-localize');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');
var zip = require('gulp-zip');

function intl() {
    return i18n({
        locales: ['en-US', 'de-DE'],
        localeDir: './locales',
        schema: 'suffix'
    });
}

gulp.task('html', function() {
    return gulp.src('*_web.html')
        .pipe(include())
        .pipe(intl())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('fragment', function() {
    return gulp.src('*_fragment.html')
        .pipe(include())
        .pipe(intl())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function(){
    return gulp.src(['*.js', '!gulpfile.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function(){
    return gulp.src('*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'html', 'fragment', 'js', 'css' ]);

gulp.task('dist', function() {
    return gulp.src(['./**', '!node_modules/**', '!.idea/**', '!.git/**', '!*.zip'])
        .pipe(zip('vigenere.zip'))
        .pipe(gulp.dest('.'));
})