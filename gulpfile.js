'use strictf';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    rimraf = require('rimraf'),
    prefixer = require('gulp-autoprefixer'),
    pngquant = require('imagemin-pngquant'),
    cssmin = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    responsive = require('gulp-responsive'),
    
    reload = browserSync.reload;

var path = {
    build: {
        html: "build/",
        js: "build/js/",
        css: "build/css/",
        img: "build/img/",
        fonts: "build/fonts/"
    },
    src: {
        html: "src/*.html",
        js: "src/js/main.js",
        css: "src/css/main.scss",
        img: "src/img/**/*.*",
        fonts: "src/fonts/**/*.*"
    },
    watch: {
        html: "src/**/*.html",
        js: "src/js/**/*.js",
        css: "src/css/**/*.scss",
        img: "src/img/**/*.*",
        fonts: "src/fonts/**/*.*"
    },
    clean: "./build"
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "htask1"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function(){
    gulp.src(path.src.img)
        .pipe(responsive(
            {
                '*.*':[
                    {
                        width: 320,
                        //crop: true,
                        rename: ({
                            suffix: '-xs'
                        })
                    },{
                        width: 768,
                        //crop: true,
                        rename: ({
                            suffix: '-md'
                        }),
                    },
                    {
                        
                    }
                ],
            },
            {
                errorOnEnlargement: false
            }
        ))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function(){
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});


gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'image:build',
    'fonts:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
     watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
     });
     watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function(){
    browserSync(config);
});

gulp.task('clean', function(cb){
    rimraf(path.clean, cb)
});

gulp.task('default', ['build', 'webserver', 'watch'])
