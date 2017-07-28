'use strict';


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

const fs = require('fs')
const path = require('path')

// const runSequence = require('run-sequence')
// const del = require('del')

// Sass and CSS Stuff
const gulp              = require('gulp');
const sass              = require('gulp-sass');
const sassGlob          = require('gulp-sass-glob');
const autoprefixer      = require('gulp-autoprefixer');
const notify            = require("gulp-notify");

// JS Things
const concat            = require('gulp-concat');
const theo              = require('theo')

// Local Server Stuff
const browserSync       = require('browser-sync').create();
const reload            = browserSync.reload;
const connect           = require('gulp-connect');
const backstopjs        = require('backstopjs');

// Housekeeping
const fractal           = require('./fractal.js');
const logger            = fractal.cli.console;



// -----------------------------------------------------------------------------
// Paths
// -----------------------------------------------------------------------------

const paths = {
  designTokens: './design-tokens',
  generated: './.generated',
  output: './.www'
}


// -----------------------------------------------------------------------------
// Fractal Tasks
// -----------------------------------------------------------------------------

/*
 * Configure a Fractal instance.
 *
 * This configuration could also be done in a separate file, provided that this file
 * then imported the configured fractal instance from it to work with in your Gulp tasks.
 * i.e. const fractal = require('./my-fractal-config-file');
 */

const fractal = require('@frctl/fractal').create();

// title for the project
fractal.set('project.title', 'Fannie Mae Fractal Component Demo'); 

// destination for the static export
fractal.web.set('builder.dest', 'build'); 

// location of the documentation directory.
fractal.docs.set('path', `${__dirname}/docs`); 

// register the Nunjucks adapter for your components
fractal.components.engine('@frctl/nunjucks'); 

// look for files with a .nunj file extension
fractal.components.set('ext', '.nunj'); 

// location of the component directory.
fractal.components.set('path', `${__dirname}/components`); 

// keep a reference to the fractal CLI console utility
const logger = fractal.cli.console; 

/*
 * Start the Fractal server
 *
 * In this example we are passing the option 'sync: true' which means that it will
 * use BrowserSync to watch for changes to the filesystem and refresh the browser automatically.
 * Obviously this is completely optional!
 *
 * This task will also log any errors to the console.
 */

gulp.task('fractal:start', function(){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});

/*
 * Run a static export of the project web UI.
 *
 * This task will report on progress using the 'progress' event emitted by the
 * builder instance, and log any errors to the terminal.
 *
 * The build destination will be the directory specified in the 'builder.dest'
 * configuration option set above.
 */

gulp.task('fractal:build', function(){
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
        logger.success('Fractal build completed!');
    });
});



// -----------------------------------------------------------------------------
//  Visual Regression Tests
// -----------------------------------------------------------------------------

var backstopConfig = {
  //Config file location
  config: './backstopConfig.js'
}

gulp.task('backstop_reference', () => backstopjs('reference', backstopConfig));
gulp.task('backstop_test', () => backstopjs('test', backstopConfig));

gulp.task('tests', function(done) {
  connect.server({
    port: 8888
  });
  done();
});
gulp.task('testdone', function(done) {
  connect.serverClose();
  done();
});

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// Sass and CSS Configarables
const autoprefixerOptions = { browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] };


// -----------------------------------------------------------------------------
// Sass and CSS Tasks
// -----------------------------------------------------------------------------

gulp.task('css', function() {
  return gulp.src('./assets/sass/styles.scss')
  .pipe(sassGlob())
  .pipe(sass({
    sourcemap: true,
    sourcemapPath: './components/',
  })).on('error', notify.onError(function (error) {return "Problem file : " + error.message;}))
  .pipe(autoprefixer(autoprefixerOptions))
  .pipe(browserSync.stream())
  .pipe(gulp.dest('./public/css'));
});


// -----------------------------------------------------------------------------
// JavaScript Tasks
// -----------------------------------------------------------------------------

// gulp.task('scripts', function() {
//   return gulp.src(['./patterns/**/*.js'])
//   .pipe(concat('scripts.js'))
//   .pipe(gulp.dest('./public/js/'));
// });

// -----------------------------------------------------------------------------
//  Watch Tasks
// -----------------------------------------------------------------------------

gulp.task('watchCSS', function(done) {
  gulp.watch(
    'assets/sass/**/*.scss', 
    'components/**/*.scss', 
    gulp.series('css')).on('change', reload);
  done();
});

// gulp.task('watchJS', function(done) {
//   gulp.watch('assets/ja/**/*.js', gulp.series('scripts')).on('change', reload);
//   done();
// });



// -----------------------------------------------------------------------------
// Default Tasks
// -----------------------------------------------------------------------------


gulp.task('watch', gulp.parallel('watchCSS', 'watchJS'));

gulp.task('dev', gulp.parallel('fractal:start', 'css', 'watch'));

gulp.task('vizres-setup', gulp.series('tests', 'css', 'backstop_reference', 'testdone'));
gulp.task('vizres-test', gulp.series('tests', 'css', 'backstop_test', 'testdone'));





