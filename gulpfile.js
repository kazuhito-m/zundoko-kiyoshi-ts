var gulp = require('gulp');
// var concat = require('gulp-concat');

// typescriptのオブジェクトと、tsconfig.jsonを読み込んだプロジェクトオブジェクト作成。 
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json', function() {
  typescript: require('typescript')
});

gulp.task('test-transpile', function() {
  // 対象となるファイルを全部指定
  gulp.src(['./src/main/*.ts','./src/test/*.ts'])
    .pipe(typescript(tsProject))
    // jsプロパティを参照
    .js 
    // ファイルをひとまとめに
    // .pipe(concat("main.js"))
    .pipe(gulp.dest('./test-build/'));
});
