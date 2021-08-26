/**
 * Gulp task for generating api documentation
 */

const gulp = require('gulp');
const minimist = require('minimist');
const apidoc = require('gulp-apidoc');

const argv = minimist(process.argv.slice(2));

const type = argv.type ? argv.type : 'web';

gulp.task('apidoc', done => {
  apidoc(
    {
      src: `${gulp.paths.root}/${type}`,
      dest: `${gulp.paths.docs}/${type}`,
      config: `${gulp.paths.root}/${type}`,
    },
    done,
  );
});
