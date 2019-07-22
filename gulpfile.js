var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var watch = require("gulp-watch");

gulp.task("default", function () {
  return tsProject.src()
      .pipe(tsProject())
      .js.pipe(gulp.dest("build"));
});

gulp.task("watch", function () {
  watch('src/**/*', gulp.series('default'));
});