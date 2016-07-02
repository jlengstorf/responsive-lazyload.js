# Lazyload Images Responsively

This was inspired by <https://github.com/ivopetkov/responsively-lazy/>, but I found the implementation to be a little over-engineered. This solution uses similar markup, but hugely simplifies the way the actual image replacement is handled. It also adds an optional fallback for when JavaScript is disabled.

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
