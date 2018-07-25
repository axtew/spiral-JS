"use strict";

const gulp = require('gulp'),
      pug = require('gulp-pug'),
      sourcemaps = require('gulp-sourcemaps'),
      del = require('del'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      plumber = require('gulp-plumber'),
      moduleImporter = require('sass-module-importer'),
      browserSync = require('browser-sync').create(),
      gulpWebpack = require('gulp-webpack'),
      webpack = require('webpack'),
      sassGlob = require('gulp-sass-glob'),
      webpackConfig = require('./webpack.config.js');

const paths = {
  root: './build',
  templates: {
    pages: './src/templates/pages/*.pug',
    src: './src/templates/**/*.pug',
    build: 'build/assets/'
  },
  styles: {
    src: './src/scss/**/*.scss',
    dest: './build/assets/css/'
  },
  images: {
    src: './src/img/**/*.*',
    dest: './build/assets/img/'
  },
  fonts: {
    src: './src/fonts/**/*.*',
    dest: './build/assets/fonts/'
  },
  scripts: {
    src: './src/js/**/*.*',
    dest: './build/assets/scripts/'
  }
}

// слежка
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  // gulp.watch(paths.images.src, images);
  // gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.scripts.src, scripts);
}

// сервер
function server() {
  browserSync.init({
    server: paths.root
  });
  browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// // перенос картинок
// function images() {
//   return gulp.src(paths.images.src)
//     .pipe(gulp.dest(paths.images.dest));
// }

// // перенос шрифтов
// function fonts() {
//   return gulp.src(paths.fonts.src)
//     .pipe(gulp.dest(paths.fonts.dest));
// }

// компиляция pug
function templates() {
  return gulp.src(paths.templates.pages)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.root));
}

// компиляция scss
function styles() {
  return gulp.src('./src/scss/main.scss')
    .pipe(sassGlob())
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed',
        importer: moduleImporter()
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
  return gulp.src('./src/js/main.js')
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest));
}

// очистка
function clean() {
  return del(paths.root);
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
// exports.images = images;
// exports.fonts = fonts;
exports.scripts = scripts;

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(styles, templates, scripts),
  gulp.parallel(watch, server)
));
