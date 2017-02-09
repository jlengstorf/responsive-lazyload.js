import { lazyLoadImages } from './responsive-lazyload';

// This feels hacky, but allows us to DRY out the test code a bit.
let image = false;

describe('enables lazy loading of images', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="js--lazyload">
        <img id="will-load"
             alt="image description"
             src="images/example@2x.jpg"
             srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
             data-lazyload="images/example-300x150.jpg 300w,
                            images/example-600x300.jpg 600w,
                            images/example.jpg 690w,
                            images/example@2x.jpg 1380w">
      </div>
      <div class="js--lazyload">
        <img id="will-not-load"
             alt="image description"
             src="images/example2@2x.jpg"
             srcset="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
             data-lazyload="images/example2-300x150.jpg 300w,
                            images/example2-600x300.jpg 600w,
                            images/example2.jpg 690w,
                            images/example2@2x.jpg 1380w">
      </div>
    `;

    // JSDOM doesn’t support `getBoundingClientRect()`, so we have to fake it.
    // See https://github.com/tmpvar/jsdom/issues/653)
    document.querySelector('#will-not-load').getBoundingClientRect = () => ({
      top: 800,
      bottom: 1200,
    });

    lazyLoadImages();
  });

  afterEach(() => {
    // Unset the image after all tests.
    image = false;
  });

  describe('loads all on-screen images', () => {
    beforeEach(() => {
      image = document.querySelector('#will-load');
    });

    test('sets the `data-loaded` attribute to "true"', () => {
      expect(image.getAttribute('data-loaded')).toBe('true');
    });

    test('sets the `srcset` attribute with the images', () => {
      expect(image.srcset).toEqual(image.getAttribute('data-lazyload'));
    });
  });

  describe('doesn’t load any off-screen images', () => {
    beforeEach(() => {
      image = document.querySelector('#will-not-load');
    });

    test('does NOT set the `data-loaded` attribute', () => {
      expect(image.getAttribute('data-loaded')).toBeNull();
    });

    test('does NOT change the `srcset` attribute', () => {
      expect(image.srcset).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    });
  });
});
