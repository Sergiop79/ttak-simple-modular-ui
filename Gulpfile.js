'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var lr = require('tiny-lr');
var livereload = require('gulp-livereload');
var reloadServer = lr();


// Styles
gulp.task('styles', function () {
  gulp.src('./src/scss/style.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(gulp.dest('./src/css'))
    .pipe(livereload({
      auto: false
    }));
});

// Minyfy Styles
gulp.task('cssmin', function () {
    gulp.src('src/css/style.css')
        .pipe(cssmin())
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});


// index.html live reload
gulp.task('html', function () {
  gulp.src('./src/index.html')
    .pipe(livereload({
      auto: false
    }));
});

// Minify HTML
gulp.task('htmlmin', function() {
  gulp.src('src/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

// Minify JS
gulp.task('uglify', function() {
  gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// Optimize images
gulp.task('imagemin', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img/'));
});



// Server for development
gulp.task('dev-server', function () {
  var http = require('http');
  var st = require('node-static');
  var opts = {
    cache: false
  };
  var file = new st.Server('./src/', opts);
  var port = process.env.PORT || 3000;

  http.createServer(function (req, res) {
    file.serve(req, res);
  }).listen(port);

  console.log('App running in http://localhost:%s', port);
});

// Server for distribution
gulp.task('dist-server', function () {
  var http = require('http');
  var st = require('node-static');
  var opts = {
    cache: false
  };
  var file = new st.Server('./dist/', opts);
  var port = process.env.PORT || 8000;

  http.createServer(function (req, res) {
    file.serve(req, res);
  }).listen(port);

  console.log('App running in http://localhost:%s', port);
});

// Watch files and run some tasks
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(['./src/scss/**/*.scss'], ['styles']);
  gulp.watch(['./src/index.html'], ['html']);
});

gulp.task('default', ['watch', 'styles', 'html', 'dev-server']);
gulp.task('dist', ['styles', 'cssmin', 'htmlmin', 'uglify', 'imagemin', 'dist-server']);
