Preassumed you have already setup node, npm and bower.
## Step 1:  Install required packages 
```
npm install --save gulp gulp-connect gulp-open browserify reactify 
    vinyl-source-stream gulp-concat gulp-eslint
```

## Step 2: Gulpfile.js to setup html file

On your root of application create or edit the gulpfile.js file and the first setup gulp like below.

```
var gulp = require("gulp");
var connect = require("gulp-connect");
var open = require("gulp-open");
```

Create general configurations for the server.

```
var config = {
    port: 9005,
    devBaseUrl: "http://localhost",
    paths: {
        html: "./src/*.html",
        dist: "./dist",
        mainJs: './src/main.js'
    }
}
```

Add task for connect so it can reload browser automatically whenever you change the watched files . mainJs will be entry point in our application.

```
gulp.task("connect",function(){ 
     connect.server({ root: ["dist"], port: config.port, base: config.devBaseUrl, livereload: true });
});
```

Setup task for html to get serve.

```
gulp.task('html',function(){
    gulp.src(config.paths.html).
        pipe(gulp.dest(config.paths.dist)).
            pipe(connect.reload());
});
```

Open the browser automatically task as below.

```
gulp.task('open',['connect'],function(){
    gulp.src(config.devBaseUrl + ":" + config.port + "/") .pipe(open());
});
```

The destination folder will contain your productionable app.

## Step 3: configure browserify to serve js 

Below var open = require("gulp-open"); add below var's

```
var browserify = require("browserify");
var reactify = require("reactify");    
var source = require("vinyl-source-stream");
```

Addition in configration block will be

```
var config = {
    port: 9005,
    devBaseUrl: "http://localhost",
    paths: {
        html: "./src/*.html",
        js: "./src/**/*.js",
        dist: "./dist",
        mainJs: './src/main.js'
    }
}
```

The files and subfolder files under src will be included. Now setup js task,

```
gulp.task('js',function(){
browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error',console.error.bind(console))
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
});
```
