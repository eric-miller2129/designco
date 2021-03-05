const { src, series, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const prettier = require('gulp-prettier');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const paths = {
    input: './src',
    output: './build',
};

const defaults = {
    metaTitle: 'DesignCo',
    metaDescription: 'This is the default description',
    metaImage: '/assets/image/image.jpg',
    siteName: 'DesignCo',
    siteUrl: 'http://localhost:3000',
    permalink: 'http://localhost:3000/'
}

const styles = () =>
    src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('./build/assets/css'));

const pages = () =>
    src([
        `${ paths.input }/pages/**/*.html`,
        `!${ paths.input }/pages/partials/**/*.html`
    ])
    .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file',
        context: defaults
    }))
    .pipe(prettier({
        tabWidth: 4,
    }))
    .pipe(dest(paths.output));

const appScripts = () =>
    src(`${ paths.input }/js/app/app.js`)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(dest(`${ paths.output }/assets/js`))

const startServer = (done) => {
    browserSync.init({
        server: {
            baseDir: paths.output
        }
    });

    done();
}

const reloadBrowser = (done) => {
    browserSync.reload();
    done();
}

const watchSource = (done) => {
    watch(paths.input, series(exports.build, reloadBrowser));
    done();
};

exports.build = series(
    parallel(
        styles,
        pages
    )
);

exports.serve = series(
    exports.build,
    startServer,
    watchSource
);