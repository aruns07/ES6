const gulp = require('gulp');
const browserify = require('gulp-browserify');
const mocha = require('gulp-mocha');
const browser = require('browser-run');
const fs = require('fs');

gulp.task('script', () => {
    return gulp.src('./src/script/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('bundle'));
});

gulp.task('test', () => {
    gulp.src('./test/server/main.js')
        .pipe(mocha())
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
});

gulp.task('test-client-bundle', () => {
    gulp.src('./test/client/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('./test/client/bundle'));
});

gulp.task('test-in-browser', () => {
/*    gulp.src('./test/client/index.html')
        .pipe(browser({
            input: 'html'
        }))
        .pipe(process.stdout);
*/


var run = require('browser-run');
var browser = run();
browser.pipe(process.stdout);
fs.readFile('./test/client/index.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  browser.end(data);
});



});