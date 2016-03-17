var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
// var concat = require('gulp-concat');

// 定数群
const TEST_BUILD_DIR = './test-build/';

// typescriptのオブジェクトと、tsconfig.jsonを読み込んだプロジェクトオブジェクト作成。 
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json', function() {
  typescript: require('typescript')
});

gulp.task('test-transpile', function() {
  // 対象となるファイルを全部指定
  gulp.src(['./src/**/*.ts','!./src/typings/**'])
    .pipe(typescript(tsProject))
    // jsプロパティを参照
    .js
    .pipe(gulp.dest(TEST_BUILD_DIR));
});



gulp.task('test-mocha', function() {
  return gulp.src([TEST_BUILD_DIR + 'test/*.test.js'], { read: false })
    .pipe(mocha({ reporter: 'list'}))
    .on('error', gutil.log);
});