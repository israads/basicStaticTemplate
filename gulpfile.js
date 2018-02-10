var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify  = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
//var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var uncss = require('gulp-uncss');

var ORI = 'working';
var DEST = 'app';



// *** HTML *** Compila, comprime y coloca en carpeta
gulp.task('html', function() {
  return gulp.src(ORI + '/html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(DEST + '/'))    
    .pipe(connect.reload());//Reload
});	

//*** SASS *** Compila, concatena, inserta prefixer, comprime y coloca en carpeta
gulp.task('sass', function(){
	return gulp.src([
				ORI + '/assets/sass/application.scss',
				ORI + '/assets/sass/**/*.*'
				])
		.pipe(sass().on('error', sass.logError)) //Compila SASS en el orden colocado
		.pipe(concat('style.min.css')) //Concatena los archivos css generados
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false})) // agrega Autoprefijos
        .pipe(uncss({ html: [ORI + '/html/**/*.html'] })) //Limpia css que encuenta que no se usa dentro el html
		.pipe(cssnano())//Comprime css
		.pipe(gulp.dest(DEST + '/assets/css/'))
		.pipe(connect.reload());//Inyecta el css
	});

//*** JAVASCRIPT *** Concatena, comprime y coloca en carpeta
gulp.task('js', function(){
	gulp.src(ORI + '/assets/js/**/*.js')
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(DEST + '/assets/js'))	
	.pipe(connect.reload());//Reload
	})
	

//*** IMÁGENES *** Minifica y coloca en carpeta
gulp.task('minImg', function(){
	gulp.src(ORI + '/assets/img/*')
	.pipe(imagemin())
	.pipe(gulp.dest(DEST + '/assets/img'))
	.pipe(connect.reload());
	});	


// *** RELOAD *** Server estático para reload
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './app/index.html'
    });
});


gulp.task('server', function () {
    connect.server({
    	root: 'app',    	
    	livereload: true,    	
    });
});



// *** Tareas principales *** Todas las tareas a realizar por Default
gulp.task('watch', ['html', 'minImg','js', 'sass' ],function(){	
	gulp.watch(ORI + '/assets/sass/**/*', ['sass']); // Comienza a detectar cambios de SASS
	gulp.watch(ORI + '/assets/js/**/*.js', ['js']);// Comienza a detectar cambios de JS
	gulp.watch(ORI + '/html/**/*.html', ['html']);
	gulp.watch(ORI + '/assets/img/**/*.*',['minImg']);

});

// *** Tarea Default *** Ejecuta todo sin escribir sentencia
gulp.task('default', ['server', 'watch']);