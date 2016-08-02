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
Browserify will create a separate module and before creating a bunlde.js in dist folder convert all JSX code to plain old javascript.

## Step 4: CSS task

After add var source = require("vinyl-source-stream"); add conact like below, so css can be bundled into one file.

```
var concat = require("gulp-concat");
```

Addition in configuration block will be

```
var config = {
    port: 9005,
    devBaseUrl: "http://localhost",
    paths: {
        html: "./src/*.html",
        js: "./src/**/*.js",
        dist: "./dist",
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',            
        ],
        mainJs: './src/main.js'
    }
}
```

You can add whatever files, you want to include. For example sake, i have added bootstrap to illustrate. How to include files.

```
gulp.task('css',function(){
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
});
```

This will create bundle.css file in dist folder which can be included in html files later.

## Step 5: Eslint to maintain code quality


Add the last file for this setup on top.

```
var eslint = require("gulp-eslint");
```

Add lint task like below,

```
gulp.task('linter',function(){
    return gulp.src(config.paths.js)
        .pipe(eslint({config: "eslint.config.json"}))
        .pipe(eslint.format());    
});
```

eslint.config.json will be somewhat like this but you can tweak it as you like.

```
{
  "ecmaFeatures": {
    "jsx": true
  },
  "env": {
    "browser": true,
    "node": true,
    "jquery": true
  },
  "rules": {
    "quotes": 0,
    "no-trailing-spaces": 0,
    "eol-last": 0,
    "no-unused-vars": 0,
    "no-underscore-dangle": 0,
    "no-alert": 0,
    "no-lone-blocks": 0
  },
  "globals": {
    jQuery: true,
    $: true
  }
}
```

Globals are the elements which are required for some third party plugins, in my case bootstrap requires jQuery to be global.

## Step 6: Add watcher and default tasks to be run

So we are almost done with this configurations. Add a watcher task.

```
gulp.task('watch',function(){
    gulp.watch(config.paths.html,['html']);
    gulp.watch(config.paths.js,['js','linter']);
});
```

Setup all default task to be run on start.

```
gulp.task('default',['html','js' , 'css' , 'linter' , 'open' , 'watch' ]);
```
