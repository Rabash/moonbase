var path = require('path'),
    options = {};

// #############################
// Edit these paths and options.
// #############################

// The root paths are used to construct all the other paths in this
// configuration. The "project" root path is where this gulpfile.js is located.
// While Zen distributes this in the theme root folder, you can also put this
// (and the package.json) in your project's root folder and edit the paths
// accordingly.
options.rootPath = {
  styleGuide  : '../docs/styleguide/',
  sassDoc     : '../docs/sassdoc/',
  theme       : '../'
};

options.theme = {
  root    : options.rootPath.theme,
  css     : options.rootPath.theme + 'css/',
  sass    : options.rootPath.theme + 'scss/',
  js      : options.rootPath.theme + 'js/',
  images  : options.rootPath.theme + 'images/'
};

// Define the style guide paths and options.
options.styleGuide = {
  source: [
    options.theme.sass
  ],
  destination: options.rootPath.styleGuide,

  // The css and js paths are URLs, like '/misc/jquery.js'.
  // The following paths are relative to the generated style guide.
  css: [
    path.relative(options.rootPath.styleGuide, options.theme.css + 'screen.css')
  ],
  js: [
  ],
  builder: options.rootPath.styleGuide + 'template',
  homepage: options.theme.sass + 'styleguide.md',
  title: 'Style Guide'
};

// Define the path to the project's .scss-lint.yml.
options.scssLint = {
  yml: options.theme.sass + '.scss-lint.yml'
};

// ################################
// Load Gulp and tools we will use.
// ################################
var gulp        = require('gulp'),
    gcmq        = require('gulp-group-css-media-queries'),
    del         = require('del'),
    sassdoc     = require('sassdoc'),
    plugins     = require('gulp-load-plugins')({
      replaceString: /\bgulp[\-.]/
    }),
    kss         = require('kss');

// Default Task
gulp.task('default', ['build']);

// #################
// Build everything.
// #################
gulp.task('build', ['lint', 'styles:production', 'styleguide', 'sassdoc']);

// ##########
// Build CSS.
// ##########
gulp.task('styles', function () {
  return gulp.src([
    options.theme.sass + '*.scss'
  ])
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sassGlob())
  .pipe(plugins.sass({errLogToConsole: true}))
  .pipe(gcmq())
  .pipe(plugins.autoprefixer({
      browsers: ['> 0.05%', 'last 2 versions'],
      cascade: false
  }))
  .pipe(plugins.sourcemaps.write(options.theme.css + 'maps'))
  .pipe(gulp.dest(options.theme.css));
});

gulp.task('styles:production', function () {
  return gulp.src([
    options.theme.sass + '*.scss'
  ])
  .pipe(plugins.sassGlob())
  .pipe(plugins.sass({errLogToConsole: true}))
  .pipe(gcmq())
  .pipe(plugins.autoprefixer({
      browsers: ['> 0.05%', 'last 2 versions'],
      cascade: false
  }))
  .pipe(gulp.dest(options.theme.css));
});

// #########
// Build JS.
// #########
gulp.task('script', function() {
  return gulp.src([
      options.theme.js + 'lib/*',
      options.theme.js + 'global.js'
    ])
    .pipe(plugins.uglify())
    .pipe(plugins.concat('script.min.js'))
    .pipe(gulp.dest(options.theme.js + 'min'));
});

// ##################
// Build sassDoc.
// ##################
gulp.task('sassdoc', function () {
  return gulp.src('../scss/**/*.scss')
    .pipe(sassdoc({
      dest: options.rootPath.sassDoc
    }));
});

// ##################
// Build style guide.
// ##################
gulp.task('styleguide', function() {
  return kss(options.styleGuide);
});

gulp.task('styleguide:color-kss-markup', function() {
  return gulp.src(options.rootPath.styleGuide + 'template/helpers/color-kss-markup.scss')
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.replace(/(\/\*|\*\/)\n/g, ''))
    .pipe(plugins.rename('color-kss-markup.twig'))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(options.theme.sass + 'settings'));
});

// #########################
// Lint Sass and JavaScript.
// #########################
gulp.task('lint', ['lint:sass']);

gulp.task('lint:sass', function() {
  return gulp.src(options.theme.sass + '**/*.scss')
    .pipe(plugins.scssLint({'config': options.scssLint.yml}));
});

// #######################
// Compile styleguide sass
// #######################
gulp.task('styleguide:sass', function () {
  return gulp.src([
      '../docs/styleguide/template/kss-assets/*.scss'
    ])
    .pipe(plugins.sassGlob())
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(gulp.dest('../docs/styleguide/template/kss-assets/'));
});

// ##############################
// Watch for changes and rebuild.
// ##############################
gulp.task('watch', function() {
    gulp.watch(options.theme.sass + '**/*.scss', ['lint', 'styles', 'sassdoc', 'styleguide']);
});

// #####################################
// Minify images, and create svg sprite.
// #####################################
gulp.task('images', function () {
  return gulp
    .src(options.theme.images + 'svg/*.svg')
    .pipe(plugins.cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(plugins.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(plugins.svgstore())
    .pipe(gulp.dest(options.theme.images));
});

// ######################
// Clean all directories.
// ######################
gulp.task('clean', ['clean:css', 'clean:styleguide']);

// Clean style guide files.
gulp.task('clean:styleguide', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([
      options.styleGuide.destination + '*.html',
      options.styleGuide.destination + 'public',
      options.theme.css + '**/*.hbs'
    ], {force: true});
});

// Clean CSS files.
gulp.task('clean:css', function() {
  return del([
      options.theme.root + '**/.sass-cache',
      options.theme.css + '**/*.css',
      options.theme.css + '**/*.map'
    ], {force: true});
});
