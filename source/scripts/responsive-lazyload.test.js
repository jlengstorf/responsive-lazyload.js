import { lazyLoadImages } from './responsive-lazyload';

// We simulate the load event to ensure we’re handling it properly.
const loadEvent = new Event('load');
const scrollEvent = new Event('scroll');

const gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

// This feels hacky, but allows us to DRY out the test code a bit.
let image = false;

describe('enables lazy loading of images', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loaded-container" class="js--lazyload">
        <img id="will-load"
             alt="image description"
             src="images/example@2x.jpg"
             srcset="${gif}"
             data-lazyload="images/example-300x150.jpg 300w,
                            images/example-600x300.jpg 600w,
                            images/example.jpg 690w,
                            images/example@2x.jpg 1380w">
      </div>
      <div id="loaded-container-with-nesting" class="js--lazyload">
        <a href="https://code.lengstorf.com/">
          <img id="with-link"
               alt="image description"
               src="images/example@2x.jpg"
               srcset="${gif}"
               data-lazyload="images/example-300x150.jpg 300w,
                              images/example-600x300.jpg 600w,
                              images/example.jpg 690w,
                              images/example@2x.jpg 1380w">
        </a>
      </div>
      <div id="unloaded-container" class="js--lazyload">
        <img id="will-not-load"
             alt="image description"
             src="images/example2@2x.jpg"
             srcset="${gif}"
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

  describe('handles container loading classes appropriately', () => {
    test('adds the loading class to each container', () => {
      const container = document.querySelector('#unloaded-container');
      expect(container.classList.contains('js--lazyload--loading')).toBe(true);
    });

    test('removes the loading class from an image container', () => {
      const container = document.querySelector('#loaded-container');
      container.querySelector('img').dispatchEvent(loadEvent);
      expect(container.classList.contains('js--lazyload--loading')).toBe(false);
    });

    test('removes the loading class from a container with nesting', () => {
      const container = document.querySelector('#loaded-container-with-nesting');
      container.querySelector('img').dispatchEvent(loadEvent);
      expect(container.classList.contains('js--lazyload--loading')).toBe(false);
    });
  });

  describe('loads an image once it enters the viewport', () => {
    test('', (done) => {
      const container = document.querySelector('#unloaded-container');
      const imageToLoad = document.querySelector('#will-not-load');

      // We want to simulate scrolling into the viewport, so we overwrite this.
      imageToLoad.getBoundingClientRect = () => ({
        top: 0,
        bottom: 400,
      });

      // Simulate scrolling
      const scroller = setInterval(() => {
        window.dispatchEvent(scrollEvent);
      }, 10);

      // Stop scrolling after 200ms
      setTimeout(() => {
        clearInterval(scroller);

        imageToLoad.dispatchEvent(loadEvent);

        expect(container.classList.contains('js--lazyload--loading')).toBe(false);
        expect(imageToLoad.getAttribute('data-loaded')).toBe('true');

        done();
      }, 200);
    });
  });
});
