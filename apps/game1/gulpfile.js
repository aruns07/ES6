const gulp = require('gulp');
const browserify = require('gulp-browserify');
const htmlReplace = require('gulp-html-replace');

const tape = require('gulp-tape');
const tapColorize = require('tap-colorize');

const run = require('browser-run');
const browser = run({input: 'html'});

const fs = require('fs');

gulp.task('script', () => {
    return gulp.src('./src/script/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('bundle'));
});


gulp.task('test-on-server', () => {
    return gulp.src('./test/server/main.js')
        .pipe(tape({
          reporter: tapColorize()
        }));
});


gulp.task('test-client-bundle', () => {
    return gulp.src('./test/client/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('./test/client/bundle'));
});


gulp.task('test-inject', ['test-client-bundle'], () => {
    return gulp.src('./test/client/index.html')
            .pipe(htmlReplace({
                  jsInline: {
                    src: gulp.src('./test/client/bundle/main.js'),
                    tpl: '<script>%s</script>'
                  }
                }))
            .pipe(gulp.dest('./test/client/bundle/'));;
});


gulp.task('test-in-browser', ['test-inject'], () => {
    /*gulp.src('./test/client/index.html')
        .pipe(browser({
            input: 'html'
        }))
        .pipe(process.stdout);*/

    browser.pipe(tapColorize()).pipe(process.stdout);
    fs.readFile('./test/client/bundle/index.html', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      browser.end(data);
    });

});

gulp.task('test', ['test-on-server', 'test-in-browser'])