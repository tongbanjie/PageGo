var
  gulp        = require('gulp'),
  watch       = require("gulp-watch"),
  connect     = require('gulp-connect'),
  revReplace  = require('gulp-rev-replace'),
  pretty      = require('pretty'),
  yargs       = require('yargs'),
  fs          = require('fs-extra'),
  readdirp    = require('readdirp'),
  exec        = require('child_process').exec,
  React       = require('react'),
  spawn       = require('child_process').spawn,
  packageJson = require('./package.json');

require('babel-core/register');
require('babel-polyfill');

var ReactDOMServer = require('react-dom/server'),
  _html = require('./src/_html.jsx');

var argv = yargs.usage('Usage: $0 ').argv,
  production = argv.p;

var devType = argv._[0] == 'dev';

var cfg = {
  rev_manifest: '.rev-manifest.json'
};
var dest = 'dest';

gulp.task('other', function() {
  exec('rm -rf ./' + dest);
  return gulp.src(['src/**/*.!(html|js|css|jsx)', 'src/*/base.css']).pipe(gulp.dest(dest));
});

gulp.task('minify-js', function(cb) {
  var param, env=[];
  if (production) {
    param = {
      PRODUCTION: true
    }
    env = ['--env.param=' + JSON.stringify(param)]
  }
  if (devType) {
    env.push('--watch', '--progress')
  }
  var webpack = spawn('./node_modules/webpack/bin/webpack.js', env, {stdio: 'inherit'});
  webpack.on('exit', (code) => {
    webpack.kill()
  });
  if (devType) {
    cb();
  } else {
    webpack.on('close', function(){
      cb();
    })
  }
});

gulp.task('createhtml', function(cb){
  var importJs = 'export default {\n'
  readdirp({ root: './src/pages', fileFilter: [ '*.js', '*.jsx' ] })
  .on('data', function (entry) {
    // 生成动态的importJs，定义需要引入哪些页面
    if (!entry.parentDir || entry.parentDir && (entry.name.toLowerCase()).split('.')[0]=='index') {
      var outfileName = entry.parentDir.replace(/\//g, '') + ((entry.name).split('.'))[0] + 'Page';
      var htmlname = (entry.parentDir || (entry.name.split('.'))[0]).toLowerCase();
      importJs += '  "'+htmlname+'": function(){\n';
      importJs += '    return import(/* webpackChunkName: "' + outfileName + '" */"../src/pages/' + (entry.parentDir || entry.path) + '").then(_ => {\n';
      importJs += '      return _.default;\n';
      importJs += '    })\n';
      importJs += '  },\n';

      // 生成对应的html文件
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(_html.default, {
        path: htmlname,
        pureWap: packageJson.clientType === 'wap'
      }));

      htmlname = './' + dest + '/' + (htmlname + '.html').toLowerCase()
      fs.outputFile(htmlname, pretty(html), err => {
        if (err) console.log(err);
      })
    }
  })
  .on('end', function(){
    importJs += '}';
    fs.outputFile('./packCache/importpage.js', importJs, err => {
      if (err) console.log(err);
      cb();
    })
  });

})

gulp.task('html', function() {
  return gulp.src(dest + '/**/*.html')
    .pipe(
      revReplace({
        manifest: gulp.src(dest +'/'+ cfg.rev_manifest),
        modifyReved: function(fname) {
          return fname
        }
      })
    )
    .pipe(gulp.dest(dest));
});

gulp.task('watch', function(done){
  watch('src/**/*', gulp.series('other', 'createhtml'));
  connect.server({
    root: dest
  });
  done();
})

gulp.task('default', gulp.series('other', 'createhtml', 'minify-js', 'html'));

gulp.task('dev', gulp.series('other', 'createhtml', 'watch', 'minify-js'));