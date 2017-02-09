# Lazyload Images Responsively

[![Build Status](https://travis-ci.org/jlengstorf/responsive-lazyload.js.svg?branch=master)](https://travis-ci.org/jlengstorf/responsive-lazyload.js) [![Code Climate](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js/badges/gpa.svg)](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js) [![Test Coverage](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js/badges/coverage.svg)](https://codeclimate.com/github/jlengstorf/responsive-lazyload.js/coverage)

This package was inspired by <https://github.com/ivopetkov/responsively-lazy/>. It uses very similar markup, but significantly simplifies the way image replacement is handled under the hood. It also adds an optional fallback for when JavaScript is disabled.

## Examples

Check out [the examples](https://code.lengstorf.com/responsive-lazyload.js/) for more information.

## Quick Start

### Option 1: Using a Build Tool

This example assumes [webpack](https://webpack.github.io/).

#### 1. Install the module using [npm](https://www.npmjs.com/package/responsive-lazyload).

```sh
npm install --save responsive-lazyload
```

#### 2. Include the module and initialize lazyloading.

Load the module and initialize lazyloading in your app's script:

```js
import { lazyLoadImages } from 'responsive-lazyload';

lazyLoadImages();
```

#### 3. Include the stylesheet.

Include the following in the `<head>` of your document.

```html
<link rel="stylesheet" 
      href="node_modules/responsive-lazyload/dist/responsive-lazyload.min.css">
```

#### 4. Add a lazyloaded image to your markup.

Place the lazyload markup anywhere in your app's markup:

```html
<div class="js--lazyload">
  <img alt="a lazyloaded image"
       src="http://placekitten.com/400/300"
       srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
       data-lazyload="http://placekitten.com/400/300 1x,
                      http://placekitten.com/800/600 2x">
</div>
```

For more information and configuration options, see [the examples](https://jlengstorf.github.io/responsive-lazyload.js/example/).

### Option 2: Manual Download

#### 1. Download the latest release.

Download the [latest release of responsive-lazyload.js from GitHub](https://github.com/jlengstorf/responsive-lazyload.js/releases). Extract the files and place them inside your project (e.g. inside a `vendor/` directory).

#### 2. Include the script in your markup.

Just before the closing `</body>` tag, add the lazyloading script:

```html
<script src="/vendor/responsive-lazyload.js/dist/responsive-lazyload.min.js"></script>
```

#### 3. Include the styles in your markup.

Include the following in the `<head>` of your document:

```html
<link rel="stylesheet" 
      href="/vendor/responsive-lazyload.js/dist/responsive-lazyload.min.css">
```

#### 3. Initialize lazyloading.

The initialization function is stored inside a global object called `responsiveLazyload`. Initialize lazyloading by adding the following just below the script include:

```html
<script>
  responsiveLazyload.lazyLoadImages();
</script>
```

#### 4. Add a lazyloaded image to your markup.

Place the lazyload markup anywhere in your app's markup:

```html
<div class="js--lazyload">
  <img alt="a lazyloaded image"
       src="http://placekitten.com/400/300"
       srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
       data-lazyload="http://placekitten.com/400/300 1x,
                      http://placekitten.com/800/600 2x">
</div>
```

For more information and configuration options, see [the examples](https://jlengstorf.github.io/responsive-lazyload.js/example/).

## Markup

The markup to implement this is:

```html
<div class="js--lazyload js--lazyload--loading">
  <img alt="image description"
       src="/images/image@2x.jpg"
       srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
       data-lazyload="/images/image-300x150.jpg 300w,
                    /images/image-600x300.jpg 600w,
                    /images/image.jpg 690w,
                    /images/image@2x.jpg 1380w">
</div>
```

### Markup Details

- The classes can be changed, but must be updated in the call to `lazyLoadImages()`.
- The initial `srcset` is a blank GIF, which avoids an unnecessary HTTP request.
- The _actual_ `srcset` is added as `data-lazyload`.

The way `lazyLoadImages()` works is to check if the image is inside the viewport, and — if so — swap out the `srcset` for the `data-lazyload`. This is much simpler than duplicating browser behavior to choose the optimal image size; instead, we just give the browser a `srcset` and let it do its thing.

On browsers that don’t support `srcset`, the regular `src` attribute is used, so this should degrade gracefully.

### Markup With Fallback for Browsers Without JavaScript Enabled

To ensure that an image is still visible, even if JavaScript is disabled, add a `<noscript>` block with the properly marked up image using `srcset` without the lazyloading solution:

```html
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
```

## JavaScript Options

To enable lazyloading, add the following to your initialization script:

```js
import { lazyLoadImages } from './utils/lazyload-images';

lazyLoadImages({
    containerClass: 'js--lazyload',
    loadingClass: 'js--lazyload--loading',
    callback: () => {},
});
```

option           | default                 | description
---------------- | ----------------------- | -----------------------------------
`containerClass` | `js--lazyload`          | Determines which elements are targeted for lazyloading.
`loadingClass`   | `js--lazyload--loading` | Applied to containers before loading. This is useful for adding loading animations.
`callback`       | `() => {}`              | Fired on _each_ image load. Useful for adding custom functionality after an image has loaded.

## Development

To run this module locally for development, follow these steps:

```sh
# Clone the repo.
git clone git@github.com:jlengstorf/responsive-lazyload.js.git

# Move into the repo.
cd responsive-lazyload.js/

# Install dependencies.
npm install

# Run the build script.
npm run build
```

### Testing

Tests are built using [Jest](https://facebook.github.io/jest/). Run them with:

```sh
npm test

# Or, to remove all the extra crap npm spits out and only show test output:
npm test --silent
```
