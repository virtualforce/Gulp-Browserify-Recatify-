"use strict";

var gulp = require("gulp");
var connect = require("gulp-connect");
var open = require("gulp-open");
var browserify = require("browserify");
var reactify = require("reactify");
var source = require("vinyl-source-stream");
var concat = require("gulp-concat");
var eslint = require("gulp-eslint");

var config = {
	port: 9005,
	devBaseUrl: "http://localhost",
	paths: {
		html: "./src/*.html",
		js: "./src/**/*.js",
		images: "./src/images/*",	
		dist: "./dist",
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',			
		],
		mainJs: './src/main.js'
	}
}

gulp.task("connect",function(){
	connect.server({
		root: ["dist"],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('js',function(){
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error',console.error.bind(console))
		.pipe(source("bundle.js"))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('css',function(){
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'))
});

gulp.task('html',function(){
	gulp.src(config.paths.html).
		pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('images',function(){
	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dist + "/images"))
		.pipe(connect.reload());
});

gulp.task('open',['connect'],function(){
	gulp.src(config.devBaseUrl + ":" + config.port + "/") .pipe(open());
});

gulp.task('linter',function(){
	return gulp.src(config.paths.js)
		.pipe(eslint({config: "eslint.config.json"}))
		.pipe(eslint.format());	
});

gulp.task('watch',function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js','linter']);
});

gulp.task('default',['html','js' , 'css' , 'images' , 'linter' , 'open' , 'watch' ]);