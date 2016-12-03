var path        = require('path'),
    config      = {};

// #############################
// Edit these paths and config.
// #############################

// The root paths are used to construct all the other paths in this
// configuration.
config.rootPath = {
  styleGuide    : '../docs/styleguide/',
  sassDoc       : '../docs/sassdoc/',
  theme           : '../'
};

config.theme = {
  root          : config.rootPath.theme,
  css           : config.rootPath.theme + 'css/',
  sass          : config.rootPath.theme + 'scss/',
  js            : config.rootPath.theme + 'js/',
  images        : config.rootPath.theme + 'images/'
};

// Define the style guide paths and config.
config.styleGuide = {
  source: [
    config.theme.sass
  ],
  destination: config.rootPath.styleGuide,

  // The css and js paths are URLs, like '/misc/jquery.js'.
  // The following paths are relative to the generated style guide.
  css: [
    path.relative(config.rootPath.styleGuide, config.theme.css + 'screen.css'),
    path.relative(config.rootPath.styleGuide, config.theme.css + 'styleguide.css')
  ],
  js: [
    path.relative(config.rootPath.styleGuide, config.theme.js + 'min/styleguide.min.js'),
    path.relative(config.rootPath.styleGuide, config.theme.js + 'min/script.min.js')
  ],
  builder: config.rootPath.styleGuide + 'template',
  homepage: config.theme.sass + 'styleguide.md',
  title: 'Style Guide'
};

// Define the path to the project's .scss-lint.yml.
config.scssLint = {
  yml: config.theme.sass + '.scss-lint.yml'
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

// #############
// Default Task.
// #############
gulp.task('default', ['build']);

// #################
// Build everything.
// #################
gulp.task('build', ['lint', 'styles:production', 'styleguide', 'sassdoc', 'images', 'script']);

// ##########
// Build CSS.
// ##########
gulp.task('styles', function () {
  return gulp.src([
    config.theme.sass + '*.scss'
  ])
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sassGlob())
  .pipe(plugins.sass({errLogToConsole: true}))
  .pipe(gcmq())
  .pipe(plugins.autoprefixer({
      browsers: ['> 0.05%', 'last 2 versions'],
      cascade: false
  }))
  .pipe(plugins.sourcemaps.write(config.theme.css + 'maps'))
  .pipe(gulp.dest(config.theme.css));
});

gulp.task('styles:production', function () {
  return gulp.src([
    config.theme.sass + '*.scss'
  ])
  .pipe(plugins.sassGlob())
  .pipe(plugins.sass({errLogToConsole: true}))
  .pipe(gcmq())
  .pipe(plugins.autoprefixer({
      browsers: ['> 0.05%', 'last 2 versions'],
      cascade: false
  }))
  .pipe(gulp.dest(config.theme.css));
});

// #########
// Build JS.
// #########
gulp.task('script', function() {
  return gulp.src([
      config.theme.js + 'lib/*',
      config.theme.js + 'global.js'
    ])
    .pipe(plugins.uglify())
    .pipe(plugins.concat('script.min.js'))
    .pipe(gulp.dest(config.theme.js + 'min'));
});

gulp.task('script:styleguide', function() {
  return gulp.src([
      config.theme.js + 'styleguide/*'
    ])
    .pipe(plugins.uglify())
    .pipe(plugins.concat('styleguide.min.js'))
    .pipe(gulp.dest(config.theme.js + 'min'));
});

// ##############
// Build sassDoc.
// ##############
gulp.task('sassdoc', function () {
  return gulp.src('../scss/**/*.scss')
    .pipe(sassdoc({
      dest: config.rootPath.sassDoc
    }));
});

// ##################
// Build style guide.
// ##################
gulp.task('styleguide', function() {
  return kss(config.styleGuide);
});

// Task to generate styleguide markup for colors.
gulp.task('styleguide:color-kss-markup', function() {
  return gulp.src(config.rootPath.styleGuide + 'template/helpers/color-kss-markup.scss')
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.replace(/(\/\*|\*\/)\n/g, ''))
    .pipe(plugins.rename('color-kss-markup.twig'))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(config.theme.sass + 'settings'));
});

// #########################
// Lint Sass and JavaScript.
// #########################
gulp.task('lint', ['lint:sass']);

gulp.task('lint:sass', function() {
  return gulp.src(config.theme.sass + '**/*.scss')
    .pipe(plugins.scssLint({'config': config.scssLint.yml}));
});

// ##############################
// Watch for changes and rebuild.
// ##############################
gulp.task('watch', function() {
    gulp.watch(config.theme.sass + '**/*.scss', ['lint', 'styles', 'sassdoc', 'styleguide']);
});

// #####################################
// Minify images, and create svg sprite.
// #####################################
gulp.task('images', function () {
  return gulp
    .src(config.theme.images + 'svg/*.svg')
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
    .pipe(gulp.dest(config.theme.images));
});

// ######################
// Clean all directories.
// ######################
gulp.task('clean', ['clean:css', 'clean:styleguide']);

// Clean style guide files.
gulp.task('clean:styleguide', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([
      config.styleGuide.destination + '*.html',
      config.styleGuide.destination + 'public',
      config.theme.css + '**/*.hbs'
    ], {force: true});
});

// Clean CSS files.
gulp.task('clean:css', function() {
  return del([
      config.theme.root + '**/.sass-cache',
      config.theme.css + '**/*.css',
      config.theme.css + '**/*.map'
    ], {force: true});
});
