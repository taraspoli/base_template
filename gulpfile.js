'use strict';
/* параметры для gulp-autoprefixer */
var autoprefixerList = [
	'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'app/*.html',
		js: 'app/js/common.js',
		style: 'app/scss/main.scss',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*'
	},
	watch: {
		html: 'app/**/*.html',
		js: 'app/js/**/*.js',
		css: 'app/scss/**/*.scss',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*'
	},
	clean: './build/*'
	};

  var config = {
	server: {
	  baseDir: './build'
	},
	notify: true
  };

var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	webserver = require('browser-sync'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	jpegrecompress = require('imagemin-jpeg-recompress'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	rework = require('gulp-rework'),
	at2x = require('rework-plugin-at2x'),
	rigger = require('gulp-rigger'),
	plumber = require('gulp-plumber'),
	rimraf = require('gulp-rimraf'),
	cleanCSS = require('gulp-clean-css');

gulp.task('webserver', function () {
	webserver(config);
});

gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(webserver.reload({ stream: true }));
	});

gulp.task('css:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: autoprefixerList
		}))
		.pipe(rework(at2x(), { sourcemap: true }))
		.pipe(gulp.dest(path.build.css))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.build.css))
		.pipe(webserver.reload({ stream: true }));
	});

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.build.js))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.build.js))
		.pipe(webserver.reload({ stream: true }));
	});

gulp.task('fonts:build', function () {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
	});

gulp.task('image:build', function () {
	return gulp.src(path.src.img)
		.pipe(cache(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			jpegrecompress({
				progressive: true,
				max: 90,
				min: 80
			}),
			pngquant(),
			imagemin.svgo({
				plugins: [{ removeViewBox: false }]
			})
		])))
		.pipe(gulp.dest(path.build.img));
	});

gulp.task('clean:build', function () {
	return gulp.src(path.clean, { read: false })
		.pipe(rimraf());
	});

gulp.task('cache:clear', function () {
		cache.clearAll();
	});

gulp.task('build',
	gulp.series(
		'clean:build',
		gulp.parallel(
			'html:build',
			'css:build',
			'js:build',
			'fonts:build',
			'image:build'
		)
	)
);
gulp.task('watch', function () {
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.css, gulp.series('css:build'));
	gulp.watch(path.watch.js, gulp.series('js:build'));
	gulp.watch(path.watch.img, gulp.series('image:build'));
	gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('default', gulp.series(
	'build',
	gulp.parallel('webserver','watch')      
));

// gulp.task('html', function () {
// 	gulp.src('app/templates/*.html')
// 		.pipe(rigger())
// 		.pipe(gulp.dest('app'))
// 		.pipe(browserSync.reload({ stream: true }))
// });

// gulp.task('sass', function() {
// 	return gulp.src('app/sass/**/*.scss')
// 		.pipe(sourcemaps.init())
// 		.pipe(sass().on('error', sass.logError))
// 		.pipe(sourcemaps.write())
// 		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
// 		.pipe(rework(at2x(), { sourcemap: true }))
// 		.pipe(cssnano())
// 		.pipe(rename({ suffix: '.min' }))
// 		.pipe(gulp.dest('app/css'))
// 		.pipe(browserSync.reload({ stream: true }))
// });

// gulp.task('browser-sync', function() {
// 	browserSync({
// 		server: {
// 			baseDir: 'app'
// 		},
// 		notify: false
// 	});
// });

// gulp.task('scripts', function() {
// 	return gulp.src([
// 		'node_modules/jquery/dist/jquery.min.js',
// 		'node_modules/dense/src/dense.js',
// 		'node_modules/owl.carousel/dist/owl.carousel.min.js',
// 		'node_modules/jquery-nice-select/js/jquery.nice-select.min.js',
// 		'node_modules/rangeslider.js/dist/rangeslider.min.js',
// 		'node_modules/jquery-lazy/jquery.lazy.min.js',
// 		'app/libs/**/*.js'
// 	])
// 		.pipe(concat('libs.min.js'))
// 		.pipe(uglify())
// 		.pipe(gulp.dest('app/js'));
// });

// gulp.task('css-libs', ['sass'], function() {
// 	return gulp.src([
// 		'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
// 		'node_modules/jquery-nice-select/css/nice-select.css',
// 		'node_modules/rangeslider.js/dist/rangeslider.css',
// 		'app/libs/**/*.css'
// 	])
// 		.pipe(concat('libs.css'))
// 		.pipe(cssnano())
// 		.pipe(rename({ suffix: '.min' }))
// 		.pipe(gulp.dest('app/css'));
// });

// gulp.task('fonts', function() {
// 	return gulp.src([
// 		'node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-*.*',
// 		'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-*.*'
// 	])
// 		.pipe(gulp.dest('app/fonts'));
// })

// gulp.task('watch', ['browser-sync', 'html', 'css-libs', 'scripts', 'fonts'], function() {
// 	gulp.watch('app/sass/**/*.scss', ['sass']);
// 	gulp.watch('app/*.html', browserSync.reload);
// 	gulp.watch('app/templates/**/*.html', ['html']);
// 	gulp.watch('app/js/**/*.js', browserSync.reload);
// });

// gulp.task('clean', function() {
// 	return del.sync('public');
// });

// gulp.task('img', function() {
// 	return gulp.src('app/img/**/*')
//     .pipe(cache(imagemin([
// 		imagemin.gifsicle({interlaced: true}),
// 		imagemin.jpegtran({progressive: true}),
// 		imageminJpegRecompress({
// 		  loops: 5,
// 		  min: 65,
// 		  max: 70,
// 		  quality:'medium'
// 		}),
// 		imagemin.svgo(),
// 		imagemin.optipng({optimizationLevel: 3}),
// 		pngquant({quality: [0.7, 0.75], speed: 5})
// 	  ],{
// 		verbose: true
// 	  })))
// 	.pipe(gulp.dest('public/img'));
// });

// gulp.task('json', function () {
//     return gulp.src(['app/i18n/*.json'])
//         .pipe(jsonminify())
//         .pipe(gulp.dest('public/i18n'));
// });

// gulp.task('build', ['clean', 'img', 'json', 'sass', 'html', 'scripts'], function() {

// 	var buildCss = gulp.src([
// 		'app/css/main.min.css',
// 		'app/css/libs.min.css'
// 	])
// 		.pipe(gulp.dest('public/css'))

// 	var buildFonts = gulp.src('app/fonts/**/*')
// 		.pipe(gulp.dest('public/fonts'))

// 	var buildVideos = gulp.src('app/videos/**/*')
// 		.pipe(gulp.dest('public/videos'))

// 	var buildVideos = gulp.src('app/php/**/*')
// 		.pipe(gulp.dest('public/php'))

// 	var buildJs = gulp.src('app/js/**/*')
// 		.pipe(gulp.dest('public/js'))

// 	var buildHtml = gulp.src('app/*.html')
// 		.pipe(gulp.dest('public'));

// 	var bildSource = gulp.src('app/sendmail/**/*')
// 		.pipe(gulp.dest('public/sendmail'));

// 	// var bildSource = gulp.src('app/i18n/**/*')
// 	// 	.pipe(gulp.dest('public/i18n'));

// 	var buildDocs = gulp.src('app/docs/**/*')
// 		.pipe(gulp.dest('public/docs'));

// 	var buildDocs = gulp.src('app/mapsvg/**/*')
// 		.pipe(gulp.dest('public/mapsvg'));

// 	var buildDocs = gulp.src('app/favicon/**/*')
// 		.pipe(gulp.dest('public'));
// });

// gulp.task('clear', function(callback) {
// 	return cache.clearAll();
// })

// gulp.task('default', ['watch']);
