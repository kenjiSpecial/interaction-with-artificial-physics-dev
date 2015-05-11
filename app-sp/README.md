# budo-gulp-react-starter

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A "starter kit" with [budō](https://github.com/mattdesl/budo), SASS, React and Gulp.
It is based on [budo-gulp-starter](https://github.com/mattdesl/budo-gulp-starter).

Some highlights:

  - npm dependencies with browserify
  - fast incremental bundling with watchify
  - SASS for CSS pre-processing
  - LiveReload browser refresh on `bundle.js` update
  - LiveReload CSS injection on *.scss changes
  - Babel for ES6 transpiling
  - React components
  - Syntax errors shown in the browser during development

Note that budō is not tied to Gulp, and in some cases it may be easier to use it's command-line version. 

## Usage

```sh
git clone https://github.com/mattdesl/budo-gulp-starter.git
cd budo-gulp-react-starter

# install dependencies
npm install

# start development server & open browser
npm run open
```

This should run the watch server and open `localhost:9966` in your default browser. Changes to `src/js/index.js` will trigger a incremental bundle and page reload. 

Changes to files in `src/sass/` will cause CSS injection without losing application state. 

Syntax errors are overlayed in the browser with a custom style:

![img](http://i.imgur.com/dP7lH7N.png) 

## tasks

```
npm run
  start  - start dev server
  open   - start dev server and open the browser to localhost
  build  - the compressed production build
```
