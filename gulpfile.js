const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyHTML = require('gulp-minify-html');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync');
const minifyjs = require('gulp-uglify');
const buffer = require('vinyl-buffer');

gulp.task('js', () => {
  browserify('src/js/app.jsx')
  .transform(babelify, {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(minifyjs())
  .pipe(gulp.dest('dist'));
});

gulp.task('minify-html', () => {

  return gulp.src('src/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', () => {
  gulp.src('src/styles/styles.scss')
  .pipe(sass({includePaths: ['scss']}))
  .pipe(gulp.dest('./dist'));
});

gulp.task('browser-sync', () => {
  browserSync.init(["src/**/*.*"], {
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('default', ['minify-html', 'sass', 'js'], () => {
  gulp.watch("src/styles/*.scss", ['sass']);
  gulp.watch('src/**/*.jsx', ['js']);
  gulp.watch('src/*.html', ['minify-html']);
});
