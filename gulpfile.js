// va a extraer funciones instaladas en gulp 
// src -> identificar 1 archivo
// dest -> guarda
const { src, dest, watch, parallel } = require('gulp');

// CSS 
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


// IMG
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// JS 
const terser = require('gulp-terser-js');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/*.js',
    imagenes: 'src/img/**/*'
}

// un callback es una funcion que se llama despues de una funcion 
function css() {
    // Compilarlo
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('public/build/css'));
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./public/build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('public/build/img'))
}

function versionWebp(done) {
    const opciones = {
        quality: 50 // La calidad 1-100
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('public/build/img'))
    done();
}

function dev(done) {
    // watch() -> archivo que escucha por cambios
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes)
    watch(paths.imagenes, versionWebp)
    // watch( paths.imagenes, versionAvif)
    done()
}

// exports.(identificador) = (funcion a escuchar)
// para correr esta tarea -> npx gulp primerTarea
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.dev = parallel(css, imagenes, versionWebp, javascript, dev);