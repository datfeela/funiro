const { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require("gulp-autoprefixer"),
    groupMedia = require("gulp-group-css-media-queries"),
    plumber = require("gulp-plumber"),
    cleanCss = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin");

const webp = require("imagemin-webp"),
    webphtml = require("gulp-webp-html"),
    webpcss = require("gulp-webp-css");

const ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2");


const project_folder = "dist";
const source_folder = "_src";

const path = {
    build: {
        html: project_folder + "/",
        js: project_folder + "/js/",
        css: project_folder + "/css/",
        images: project_folder + "/img/",
        icons: project_folder + "/icons/",
        fonts: project_folder + "/fonts/",
        json: project_folder + "/json/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        js: [source_folder + "/js/index.js", source_folder + "/js/vendors.js"],
        css: source_folder + "/scss/index.scss",
        images: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // ["!**/favicon.*"]
        icons: source_folder + "/icons/*.svg",
        fonts: source_folder + "/fonts/*.ttf",
        json: source_folder + "/json/*.json",
    },
    watch: {
        html: source_folder + "/**/*.html",
        js: source_folder + "/**/*.js",
        css: source_folder + "/**/*.scss",
        images: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        icons: source_folder + "/icons/*.svg",
    },
    clean: "./" + project_folder + "/",

};

//functions
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder,
            directory: true
        },
        notify: false,
        port: 3000,
    });
}

function html() {
    return src(path.src.html, {})
        .pipe(plumber())
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css, {})
        .pipe(plumber())
        .pipe(
            scss({
                outputStyle: 'expanded'
            }).on('error', scss.logError)
        )
        .pipe(
            autoprefixer({
                grid: true,
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss(
            {
                webpClass: "._webp",
                noWebpClass: "._no-webp"
            }
        ))
        .pipe(groupMedia())
        .pipe(dest(path.build.css))

        .pipe(cleanCss())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js, { allowEmpty: true })
        .pipe(plumber())
        .pipe(fileinclude())
        .pipe(dest(path.build.js))

        .pipe(uglify())
        .pipe(
            rename({
                suffix: ".min",
                extname: ".js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.images)
        // .pipe(newer(path.build.images))
        .pipe(
            imagemin([
                webp({
                    quality: 75
                })
            ])
        )
        .pipe(
            rename({
                extname: ".webp"
            })
        )
        .pipe(dest(path.build.images))
        .pipe(src(path.src.images))
        // .pipe(newer(path.build.images))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 2 // 0 to 7
            })
        )
        .pipe(dest(path.build.images))
}


function icons() {
    return src(path.src.icons)
        .pipe(dest(path.build.icons))
}

function fonts() {
    src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(plumber())
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
        .pipe(browsersync.stream());
}

function json() {
    return src(path.src.json)
        .pipe(dest(path.build.json))
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.icons], icons);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(html, css, js, images, icons, fonts, json));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.icons = icons;
exports.fonts = fonts;
exports.json = json;
exports.build = build;
exports.watch = watch;
exports.default = watch;
