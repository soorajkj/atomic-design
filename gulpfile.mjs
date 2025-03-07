import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import browserSync from "browser-sync";
import terser from "gulp-terser";
import sourcemaps from "gulp-sourcemaps";

const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  html: "**/*.html",
  styles: "src/styles/**/*.scss",
  scripts: "src/scripts/**/*.js",
};

const styles = () => {
  return gulp
    .src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(bs.stream());
};

const scripts = () => {
  return gulp
    .src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/scripts"))
    .pipe(bs.stream());
};

const serve = () => {
  bs.init({ server: { baseDir: "." } });

  gulp.watch(paths.styles, styles);
  gulp.watch(paths.scripts, scripts);
  gulp.watch(paths.html).on("change", bs.reload);
};

export default gulp.series(gulp.parallel(styles, scripts), serve);
