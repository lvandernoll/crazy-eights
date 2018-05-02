let gulp = require('gulp');
let sass = require('gulp-sass');
let connect = require('gulp-connect-php7');
let browserSync = require('browser-sync').create();

gulp.task('sass', function () {
	return gulp.src('sass/index.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	connect.server({}, function() {
		browserSync.init({
			proxy: '127.0.0.1:8000',
			livereload: true,
		});
	});
});

gulp.task('watch', ['sass', 'browserSync'], function() {
	gulp.watch('sass/*.scss', ['sass']);
	gulp.watch('js/**/*.js', browserSync.reload);
	gulp.watch('index.html', browserSync.reload);
});

gulp.task('default', ['watch'], function() {
});
