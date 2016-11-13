# Moonbase base theme with Twig, Sass and Gulp
Moonbase is a base theme for kickstarting new projects. It's not tied to a
particular CMS, but tested with WordPress and Drupal 7/8.

Some of the techniques used:
- Node.js
- Gulp
- Sass
  - ITCSS
  - BEMIT
- Twig as a templating engine.
- KSS for css documentation and living style guide generation.
- SassDoc Sass documentation.

## Requirements
- Node.js

## Installation
- Run `cd .npm` to enter the hidden npm directory. *
- Run `npm install` to install packages.

* The .npm directory is hidden to avoid CMS like Drupal to interpret
node_modules as part of the theme and create performance issues.

## Getting started
- Run `gulp watch` to see the style guide at /docs/styleguide
