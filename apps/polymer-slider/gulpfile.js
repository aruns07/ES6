let gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	del = require('del'),
	less = require('gulp-less'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	gulpUglifyHarmony = require('gulp-uglify-harmony'),
	htmlReplace = require('gulp-html-replace');

gulp.task('lint', () => {
	return gulp.src('src/**/*.js')
			.pipe(eslint({
				"extends": "eslint:recommended",
				"parserOptions": {
					"ecmaVersion": 6
				},
				"rules": {
					"camelcase": 1
				}
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
});

gulp.task('script', () => {
	return gulp.src('src/**/*.js')
			//.pipe(gulpUglifyHarmony())
			.pipe(gulp.dest('dist/'));
});

gulp.task('style', () => {
	return gulp.src('src/**/*.less')
			.pipe(less())
			.pipe(autoprefixer())
			.pipe(cssnano())
			.pipe(gulp.dest('dist/'));
});

gulp.task('inject', () => {
	return gulp.src('src/components/polymer-slider.html')
			.pipe(htmlReplace({
				  cssInline: {
				    src: gulp.src('dist/components/polymer-slider.css'),
				    tpl: '<style>%s</style>'
				  }
				}))
			.pipe(gulp.dest('dist/components/'));;
});

gulp.task('html', () => {
	return gulp.src('src/**/*.html')
			.pipe(gulp.dest('dist/'));
});

gulp.task('clean', del.bind(null, ['dist/**']));

gulp.task('build', [ 'lint', 'script', 'style', 'html'], () => {
	gulp.start('inject');
});

gulp.task('default', ['clean'], () => {
	gulp.start('build');
});