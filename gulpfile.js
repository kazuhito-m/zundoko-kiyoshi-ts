var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var istanbul = require('gulp-istanbul');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var del = require('del');
var concat = require("gulp-concat");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json', function() {
    // typescriptのオブジェクトと、tsconfig.jsonを読み込んだプロジェクトオブジェクト作成。
    typescript: require('typescript')
});
// var concat = require('gulp-concat');

// 定数群
const TEST_BUILD_DIR = './test-build/';

// タスク群。

gulp.task('test-clean', function(cb) {
    return del([TEST_BUILD_DIR, './coverage'], cb);
});

gulp.task('test-src-copy' , ['test-clean'] , function() {
    return gulp.src([ './src/**' ])
        .pipe( gulp.dest(TEST_BUILD_DIR) );
});

// FIXME 以下、苦肉の策で「sourcemap取るために二回コンパイルして」いる。こんなの絶対おかしいからなおすこと。

// gulp.task('test-transpile' , ['test-src-copy'], function() {
//     // 対象となるファイルを全部指定
//     return gulp.src([TEST_BUILD_DIR + '**/*.ts','!' + TEST_BUILD_DIR + '/typings/**'] )
//         .pipe(sourcemaps.init())
//         .pipe(typescript(tsProject))
//         // jsプロパティを参照
//         .js
//         // ちょいカスタム。ソースのありか（のトップ）を指定。
//         .pipe(sourcemaps.write('./' , {includeContent: false, sourceRoot: '\/'}))
//         .pipe(gulp.dest(TEST_BUILD_DIR));
// });

gulp.task('test-transpile' , ['test-src-copy'], function() {
    // 対象となるファイルを全部指定
    return gulp.src([TEST_BUILD_DIR + '**/*.ts','!' + TEST_BUILD_DIR + '/typings/**'] )
        .pipe(typescript(tsProject))
        // jsプロパティを参照
        .js
        .pipe(gulp.dest(TEST_BUILD_DIR));
});

gulp.task('test-retranspile-main' , ['test-transpile'], function() {
    // 対象となるファイルを全部指定
    return gulp.src([TEST_BUILD_DIR + 'main/*.ts'] , {base:TEST_BUILD_DIR + 'main/'} )
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        // jsプロパティを参照
        .js
        // ちょいカスタム。ソースのありか（のトップ）を指定。
        .pipe(sourcemaps.write('./' , {includeContent: false, sourceRoot: ''}))
        .pipe(gulp.dest(TEST_BUILD_DIR + 'main/'));
});

gulp.task('pre-test', ['test-retranspile-main'] , function () {
  return gulp.src([TEST_BUILD_DIR + 'main/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'] , function() {
  return gulp.src([TEST_BUILD_DIR + 'test/*.test.js'], { read: false })
    .pipe(mocha({ reporter: 'list'}))
    .on('error', gutil.log)
    .pipe(istanbul.writeReports())
    .on('end', function() {
        // remap-istanbul(TypeScrptへのカバレッジの付け替え)
        return gulp.src('./coverage/coverage-final.json')
            .pipe(remapIstanbul({
                reports: {
                    'json': './coverage/coverage.json',
                    'html': './coverage/html-report'
                }
            }));
    })
    // アウトの基準は"75%"くらいにしとく？
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 75 } }));
});

gulp.task('preview' , function () {
    return gulp.src(['src/main/*.ts'])
        .pipe(typescript(tsProject))
        .js
        .pipe(concat('app.js'))
        .pipe(gulp.dest('site/js/'));
});

gulp.task('tsify', function () {
    return browserify()
        .add('./src/main/ZundokoKiyoshi.ts')
        .add('./src/main/ZundokoButton.ts')
        .plugin('tsify', {
            target: 'ES6',
            removeComments: true
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./site/js'));
});
