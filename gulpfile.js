/*
 * dependencies
 */

var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var symlink = require('gulp-sym');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config');

/*
 * functions
 */

function errorGraceful (error) {
  console.log(error.toString());
  this.emit('end');
}

/*
 * tasks
 */

gulp.task('build', ['clean'], function () {
  gulp.start('html');
  gulp.start('images');
  gulp.start('js');
  gulp.start('sass');
});

gulp.task('clean', function () {
  return del('test/**/*');
});

gulp.task('default', ['build']);

gulp.task('lint', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('html', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('test'));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('test/images'));
});

gulp.task('js', ['lint'], function () {
  gulp.src('src/js/**/*.js')
    .pipe(webpack(webpackConfig))
    .on('error', errorGraceful)
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('test/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('test/css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: './test',
    port: 7777,
    ui: {
      weinre: {
        port: 8080
      }
    }
  });

  gulp.watch([
    'src/index.html'
  ], ['build']);

  gulp.watch([
    'src/js/**/*'
  ], ['js']);

  gulp.watch([
    'src/sass/**/*'
  ], ['sass']);
});
