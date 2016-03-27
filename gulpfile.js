var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var istanbul = require('gulp-istanbul');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var del = require('del');
var mkdirp = require('mkdirp');
var concat = require("gulp-concat");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var typescript = require('gulp-typescript');
var ghPages = require('gulp-gh-pages');
var bump = require('gulp-bump');
var fs = require('fs');
var through = require('through2');
var git = require('gulp-git');
var typings = require("gulp-typings");
var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');
var plumber = require('gulp-plumber');
var tsProject = typescript.createProject('tsconfig.json', function () {
    // typescriptのオブジェクトと、tsconfig.jsonを読み込んだプロジェクトオブジェクト作成。
    typescript: require('typescript')
});

// 定数群
const TEST_BUILD_DIR = './test-build/';

// タスク群。

gulp.task("download-typings", function () {
    return gulp.src("./src/typings.json")
        .pipe(typings());
});

gulp.task('test-clean', function (cb) {
    return del([TEST_BUILD_DIR, './coverage'], cb);
});

gulp.task('test-src-copy', ['test-clean'], function () {
    mkdirp(TEST_BUILD_DIR);
    return gulp.src(['./src/**'])
        .pipe(gulp.dest(TEST_BUILD_DIR));
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

gulp.task('test-transpile', ['test-src-copy'], function () {
    // 対象となるファイルを全部指定
    return gulp.src([TEST_BUILD_DIR + '**/*.ts', '!' + TEST_BUILD_DIR + '/typings/**'])
        .pipe(typescript(tsProject))
    // jsプロパティを参照
        .js
        .pipe(gulp.dest(TEST_BUILD_DIR));
});

gulp.task('test-retranspile-main', ['test-transpile'], function () {
    // 対象となるファイルを全部指定
    return gulp.src([TEST_BUILD_DIR + 'main/*.ts'], { base: TEST_BUILD_DIR + 'main/' })
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
    // jsプロパティを参照
        .js
    // ちょいカスタム。ソースのありか（のトップ）を指定。
        .pipe(sourcemaps.write('./', { includeContent: false, sourceRoot: '' }))
        .pipe(gulp.dest(TEST_BUILD_DIR + 'main/'));
});

gulp.task('pre-test', ['test-retranspile-main'], function () {
    return gulp.src([TEST_BUILD_DIR + 'main/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src([TEST_BUILD_DIR + 'test/*Test.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log)
        .pipe(istanbul.writeReports())
        .on('end', function () {
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

// patchバージョンを上げる
gulp.task('verup-patch', function () {
    return gulp.src('./package.json')
        .pipe(bump({ type: 'patch' }))
        .pipe(through.obj(function (file, enc, cb) {
            // package.json からファイルを読んで、version取り出し、クラスファイルに反映。
            var packageJson = JSON.parse(file._contents);
            var code = 'export default class AppVersion {\n	public static version = "' + packageJson.version + '";\n}';
            fs.writeFile('./src/main/AppVersion.ts', code);
            cb(null, file);
        }))
        .on('end', function () {
            // 成功で終わったら、書き換えたファイルをcommit するように。
            return gulp.src(['./package.json', './src/main/AppVersion.ts'])
                .pipe(git.commit('patch version incliment.'));
        })
        .pipe(gulp.dest('./'));
});

gulp.task('build', function () {
    return browserify()
        .add('./src/main/ZundokoKiyoshi.ts')
        .add('./src/main/ZundokoButtonViewModel.ts')
        .plugin('tsify', {
            target: 'ES6',
            removeComments: true
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./site/js'));
});

gulp.task('upload-ghpages', function () {
    return gulp.src('./site/**/*')
        .pipe(ghPages());
});

// WerckerCI用の「スペシャルｇｈ−pagesアップロードタスク」。
// githubの操作用トークンを変数から取るように成ってる。
gulp.task('upload-ghpages-for-wercker', function () {
    return gulp.src('./site/**/*')
        .pipe(ghPages({ remoteUrl: "https://$GITHUB_TOKEN@github.com/kazuhito-m/zundoko-kiyoshi-ts" }));
});

gulp.task('git-push', function () {
    git.push();
});

gulp.task('deploy', function (cb) {
    // デプロイ前には必ず、バージョンアップ＆ビルドをすること。
    // Version番号をインクリメントしているので、git pushをしておく
    // (色々あったら問題だがgit的にはクリーンな状態でdeployしているだろうという推測)
    return runSequence('verup-patch', 'build', 'upload-ghpages', 'git-push', cb);
});

gulp.task('webserver', function () {
    gulp.src('./site')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html',
            open: true
        }));
});

// 「開発」というタスク。WebServerと、ソース変更で再テスト、再ビルド。
gulp.task('develop', ['webserver'], function () {
    return gulp.watch('./src/**/*.ts', function() {
        runSequence('test', 'build')
    });
});