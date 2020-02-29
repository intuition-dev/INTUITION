var gulp = require('gulp')
var less = require('gulp-less')
var LessAutoprefix = require('less-plugin-autoprefix')
var autoprefix = new LessAutoprefix( { browsers: ['last 2 versions'] } )
var debug = require('gulp-debug')

var ts = require('gulp-typescript')
var pug  = require('gulp-pug')
var riot =  require('gulp-riot')
var rename = require('gulp-rename')
gulp.task('default', defaultTask)
function defaultTask(done) {
	gulp.start('css', 'html', 'comp', 'js')
	done()
}

//
gulp.task('watch', function(done) {
	gulp.start('css', 'html', 'comp', 'js')
	gulp.watch('./www/**/*.pug', ['comp', 'css', 'html', 'js'])
	done()
})
//

gulp.task('css', function () {
	return gulp.src('./www/assets/fr7/framework7.less')
		.pipe( less(
				{ plugins: [autoprefix] }
			))
		.pipe(gulp.dest('./www/assets/fr7/'))
	})

gulp.task('html', function() {  
	return gulp.src('./www/*.pug')
		.pipe( pug(
			{ pretty: true }
		)) // pipe to pug plugin
		.pipe(gulp.dest('./www/'))
	})

gulp.task('comp', function() {  
	return gulp.src('./www/custel/*.pug')
		.pipe( pug(
			{pretty: true }
		)) // pipe to pug plugin
		.pipe( rename({ extname: '.tag'}))
		.pipe( riot( 
			{ } 
		))
		.pipe( rename({ extname: '.js'}))
		//.pipe(debug())
		.pipe(gulp.dest('./www/custel/'))
	})

gulp.task('tag', function() {  
	return gulp.src('./www/custel/*.pug')
		.pipe( pug(
			{pretty: true }
		)) // pipe to pug plugin
		.pipe( rename({ extname: '.tag'}))
		.pipe(gulp.dest('./www/custel/'))	
	})

gulp.task('js', function () {
	return gulp.src('./www/**/*.ts')
		.pipe( ts(
			{ }
		))
		.pipe(gulp.dest('./www/'))
	})