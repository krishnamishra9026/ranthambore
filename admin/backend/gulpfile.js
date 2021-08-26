const gulp = require('gulp');
const requireDir = require('require-dir');

gulp.paths = {
  dist: 'dist',
  root: 'app',
  docs: './docs/',
  protractor: [],
};

gulp.task('copy', ['copy-seed', 'copy-package', 'copy-views', 'copy-public', 'copy-pm2-config'], done => {
  done();
});

gulp.task('copy-seed', () => gulp
  .src(`./${gulp.paths.root}/seed/data/**/*.json`)
  .pipe(gulp.dest(`${gulp.paths.dist}/${gulp.paths.root}/seed/data/`)));

gulp.task('copy-package', () => gulp.src('package.json').pipe(gulp.dest(gulp.paths.dist)));

gulp.task('copy-pm2-config', () => gulp.src('ecosystem.config.js').pipe(gulp.dest(gulp.paths.dist)));

gulp.task('copy-views', () => gulp.src(`./${gulp.paths.root}/views/**/*`).pipe(gulp.dest(`${gulp.paths.dist}/${gulp.paths.root}/views`)));
gulp.task('copy-public', () => gulp.src(`./${gulp.paths.root}/public/**/*`).pipe(gulp.dest(`${gulp.paths.dist}/${gulp.paths.root}/public`)));

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// load tasks
requireDir('./tasks');
