# PASO 1 - Estructura al proyecto. # 16/01/2024
    Crear las carpetas que daran la estructura al proyecto.

# PASO 2 - Crear el archivo package.json # 16/01/2024 
    Crear el archivo package.json
    2.1 terminal ->  npm init
    Nombre del paquete -> Enter
    Version -> 1.0.0 
    Description -> Proyecto InVi
    entry point -> enter
    test command -> enter
    git repository -> https://github.com/(colocar mi URL)
    keywords -> SASS, Gulp, Composer
    author -> Mi Nombre
    licence -> enter
    yes
    Genera el archivo package.json

# PASO 3 - Normalize # 16/01/2024

# PASO 4 - Instalar Dependencia SASS 159 # 16/01/2024
    Npm install sass (si es del proyecto) / npm install sass --save-dev (solo desarrollo) - se crea nodeModules
    Si no existe el node_modules -> npm install

# PASO 5 - Instalar Gulp y crear Gulp File 161 # 16/01/2024
    Correr gulp file -> npm run dev
    Para optimizar el css,js,imagenes, compilar codigo sass, minificar imagenes, requerimos un WorkFlow 
    npm i -D gulp == npm install gulp --save-dev  
    el gulp requerira que creemos un archivo llamado gulpfile.js
    npm i -D gulp-sass
    npm i -D gulp-plumber -> si hay un error que no se detenga el workflow
    npm i -D gulp-webp -> convertir
    npm i -D gulp-imagemin@7.1.0 -> aligerar las imagenes
    npm i -D gulp-cache
    npm i -D cssnano -> minificar CSS
    npm i -D autoprefixer -> asegura que funcione el codigo CSS 
    npm i -D postcss -> complemento para gulp
    npm i -D gulp-postcss -> hace la transformacion de cssnano y autoprefixer
    npm i -D gulp-sourcemaps -> identificar en que archivo scss se encuentra
    npm i -D gulp-terser -> compresor js

# PASO 6 - Instalar Composer 395 #
    sistema -> composer install -> nos permitira instalar dependencias https://getcomposer.org/download/
    cmd -> composer init -> 
    los namespaces se crean en composer autoload 

# Archivos requeridos en Orden
funciones.php
database.php
app.php
activeRecord.php
Router
public->index.php
controller->authcontroller
includes->env

# Instalar .env BD #
    Composer require vlucas/phpdotenv - 555
    Creamos includes->.env 


 