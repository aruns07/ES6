const gulp = require('gulp');
const browserify = require('gulp-browserify');

gulp.task('build', () => {
	return gulp.src('index.js')
		.pipe(browserify({
		    transform: [["babelify", {presets: ['es2015']}]]
		  }))
		.pipe(gulp.dest('build'))
});