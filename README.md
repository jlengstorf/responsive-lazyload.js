# Lazyload Images Responsively

[![Build Status](https://travis-ci.org/jlengstorf/responsive-lazyload.js.svg?branch=master)](https://travis-ci.org/jlengstorf/responsive-lazyload.js) [![Code Climate](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js/badges/gpa.svg)](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js) [![Test Coverage](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js/badges/coverage.svg)](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js/coverage)

This was inspired by <https://github.com/ivopetkov/responsively-lazy/>, but I found the implementation to be a little over-engineered. This solution uses similar markup, but hugely simplifies the way the actual image replacement is handled. It also adds an optional fallback for when JavaScript is disabled.

Check out [the examples](https://code.lengstorf.com/responsive-lazyload.js/) for more information.

## Quick Start

### Option 1: Using a Build Tool

This example assumes [webpack](https://webpack.github.io/).

#### 1. Install the module using [Bower](https://bower.io/).

    bower install --save responsive-lazyload

#### 2. Make sure webpack is loading Bower components.

In your `webpack.config.js` or other webpack initialization, add a `resolve` handler for modules:

    resolve: {
      modulesDirectories: [ "bower_components", "node_modules" ],
    },

(Further reading: [webpack usage with Bower](https://webpack.github.io/docs/usage-with-bower.html).)

#### 3. Include the module and initialize lazyloading.

Load the module and initialize lazyloading in your app's script:

    import { lazyLoadImages } from 'responsive-lazyload';

    lazyLoadImages();

#### 4. Add a lazyloaded image to your markup.

Place the lazyload markup anywhere in your app's markup:

    <div class="js--lazyload">
      <img alt="a lazyloaded image"
           src="http://placekitten.com/400/300"
           srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
           data-lazyload="http://placekitten.com/400/300 1x,
                          http://placekitten.com/800/600 2x">
    </div>

For more information and configuration options, see [the examples](https://jlengstorf.github.io/responsive-lazyload.js/example/).

### Option 2: Manual Download

#### 1. Download the latest release.

Download the [latest release of responsive-lazyload.js from GitHub](https://github.com/jlengstorf/responsive-lazyload.js/releases). Extract the files and place them inside your project (e.g. inside a `vendor/` directory).

#### 2. Include the script in your markup.

Just before the closing `</body>` tag, add the lazyloading script:

    <script src="/vendor/responsive-lazyload.js/dist/responsive-lazyload.min.js"></script>

#### 3. Initialize lazyloading.

The initialization function is stored inside a global object called `responsiveLazyload`. Initialize lazyloading by adding the following just below the script include:

    <script>
      responsiveLazyload.lazyLoadImages();
    </script>

#### 4. Add a lazyloaded image to your markup.

Place the lazyload markup anywhere in your app's markup:

    <div class="js--lazyload">
      <img alt="a lazyloaded image"
           src="http://placekitten.com/400/300"
           srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
           data-lazyload="http://placekitten.com/400/300 1x,
                          http://placekitten.com/800/600 2x">
    </div>

For more information and configuration options, see [the examples](https://jlengstorf.github.io/responsive-lazyload.js/example/).

## Markup

The markup to implement this is:

    <div class="js--lazyload js--lazyload--loading">
      <img alt="image description"
           src="/images/image@2x.jpg"
           srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
           data-lazyload="/images/image-300x150.jpg 300w,
                        /images/image-600x300.jpg 600w,
                        /images/image.jpg 690w,
                        /images/image@2x.jpg 1380w">
    </div>

### Markup Details

- The classes can be changed, but must be updated in the call to `lazyLoadImages()`.
- The initial `srcset` is a blank GIF, which avoids an unnecessary HTTP request.
- The _actual_ `srcset` is added as `data-lazyload`.

The way `lazyLoadImages()` works is to check if the image is inside the viewport, and — if so — swap out the `srcset` for the `data-lazyload`. This is much simpler than duplicating browser behavior to choose the optimal image size; instead, we just give the browser a `srcset` and let it do its thing.

On browsers that don’t support `srcset`, the regular `src` attribute is used, so this should degrade gracefully.

### Markup With Fallback for Browsers Without JavaScript Enabled

To ensure that an image is still visible, even if JavaScript is disabled, add a `<noscript>` block with the properly marked up image using `srcset` without the lazyloading solution:

    <div class="js--lazyload js--lazyload--loading">
      <img alt="image description"
           src="/images/image@2x.jpg"
           srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
           data-lazyload="/images/image-300x150.jpg 300w,
                        /images/image-600x300.jpg 600w,
                        /images/image.jpg 690w,
                        /images/image@2x.jpg 1380w">
      <noscript>
        <img alt="image description"
             src="/images/image@2x.jpg"
             srcset="/images/image-300x150.jpg 300w,
                     /images/image-600x300.jpg 600w,
                     /images/image.jpg 690w,
                     /images/image@2x.jpg 1380w">
      </noscript>
    </div>

## JavaScript

To enable lazyloading, add the following to your initialization script:

    import { lazyLoadImages } from './utils/lazyload-images';

    lazyLoadImages({
      containerClass: 'js--lazyload',
      loadingClass: 'js--lazyload--loading',
    });

### JavaScript Details

- This approach assumes the use of a transpiler (such as [Babel](https://babeljs.io/)) to allow the use of ES2015 modules.
- The `containerClass` and `loadingClass` properties are optional; the default values are shown in the example above.
