const gulp = require('gulp');
const sass = require('gulp-sass');
const pug =  require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename =  require('gulp-rename');
const minimist = require('minimist');
const del = require('del');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();
const runSequence = require('gulp4-run-sequence');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const destDir = './dist/';
const prodDir = './htdocs/';
const config = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'dev' }
};
const options = minimist(process.argv.slice(2), config);
let isProd = (options.env === 'prod') ? true : false;
console.log('[build env]', options.env, '[isProd]', isProd);

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: destDir
    }
  });
});

gulp.task('pug', () => {
  return gulp.src(['src/site/template/pages/**/*.pug', '!src/site/**/_*.pug'])
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulpif(!isProd, gulp.dest(destDir)))
  .pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('sass', () => {
  return gulp.src(['src/site/styles/**/*.scss'])
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(sass( {
    outputStyle: 'expanded'
  }))
  .pipe(rename( (path) => {
    path.dirname = 'css'
  }))
  .pipe(autoprefixer( {
    overrideBrowserslist: ['last 2 version', 'iOS >= 10', 'Android >= 5'],
    cascade: false
  }))
  .pipe(gulpif(isProd, cleanCss()))
  .pipe(gulpif(!isProd, gulp.dest(destDir)))
  .pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
  .on('error', function handleError() {
    this.emit('end')
  })
  .pipe(gulpif(!isProd, gulp.dest(destDir)))
  .pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('images', () => {
  return gulp.src(['src/site/images/**/'])
  .pipe(gulpif(!isProd, gulp.dest(destDir + 'images/')))
  .pipe(gulpif(isProd, gulp.dest(prodDir + 'images/')))
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('clean', del.bind(null, prodDir));

gulp.task('build', gulp.series(
  gulp.parallel('pug', 'sass', 'webpack', 'images')
));

gulp.task('default', gulp.series(
  gulp.parallel('browser-sync', 'pug', 'sass', 'webpack', 'images', () => {
    watch(['src/**/*.pug'], () => {
      return runSequence(
        'pug',
        'bs-reload'
      )
    });
    watch(['src/**/*.scss'], () => {
      return runSequence(
        'sass',
        'bs-reload'
      );
    });
    watch(['src/**/*.js'], () => {
      return runSequence(
        'webpack',
        'bs-reload'
      )
    });
    watch(['src/site/images/**/*'], () => {
      return runSequence(
        'images',
        'bs-reload'
      )
    });
  })
));