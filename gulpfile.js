'use strict';
 
var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var path = require('path');
sass.compiler = require('node-sass');
var convert = require('webp-batch-convert')


gulp.task('default', function() {
	return gulp.src('./scss/*.less')
	    .pipe(less({
	      paths: [ path.join(__dirname, 'less', 'includes') ]
	    }))
	    .pipe(gulp.dest('./css'));
});




gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});


gulp.task('webp', function () {
	var res = convert.cwebp('./images', './image', {
		q: 80,
		quiet: true
	})
	console.log('total is: ' + res)
})
 