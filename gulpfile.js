const { src, series, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const prettier = require('gulp-prettier');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync');

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
        .pipe(sass().on('error', sass.logError))
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