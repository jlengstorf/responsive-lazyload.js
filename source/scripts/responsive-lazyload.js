/**
 * Check if an element is visible at all in the viewport.
 *
 * It would be cool to use an IntersectionObserver here, but browser support
 * isn’t there yet: http://caniuse.com/#feat=intersectionobserver
 *
 * @param  {Element} el the element to check
 * @return {Boolean}    `true` if the element is visible at all; `false` if not
 */
function isElementVisible(el) {
  /*
   * Checks if element (or an ancestor) is hidden via style properties.
   * See https://stackoverflow.com/a/21696585/463471
   */
  const isCurrentlyVisible = el.offsetParent !== null;

  // Check if any part of the element is vertically within the viewport.
  const position = el.getBoundingClientRect();
  const wHeight = window.innerHeight || document.documentElement.clientHeight;
  const isWithinViewport = (
    (position.top >= 0 && position.top <= wHeight) ||
    (position.bottom >= 0 && position.bottom <= wHeight)
  );

  return isCurrentlyVisible && isWithinViewport;
}

/**
 * Prevents a function from firing too often.
 * @param  {Function} func  the function to throttle
 * @param  {Number}   limit the amount of milliseconds to wait between calls
 * @return {Function}       function to check if the function should be called
 */
function throttle(func, limit = 200) {
  let wait = false;

  return () => {
    if (!wait) {
      func.call();
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  };
}

/**
 * Check if an image is visible and trigger an event if so.
 * @param  {Element} image the image to check
 * @param  {Event}   event an event to dispatch if the image is in the viewport
 * @return {Boolean}       true if the image is in the viewport; false if not
 */
const maybeTriggerImageLoad = (image, event) => {
  if (!image.getAttribute('data-loaded') && isElementVisible(image)) {
    image.dispatchEvent(event);

    return true;
  }

  return false;
};

/**
 * Finds the image to be lazyloaded.
 * @param  {Element} container `img` element to be lazyloaded or its container
 * @return {Element}           the `img` element to be lazyloaded
 */
const findImageElement = (container) => {
  const tag = container.tagName.toLowerCase();

  return tag === 'img' ? container : container.querySelector('img');
};

/**
 * This almost seems too easy, but we simply swap in the correct srcset.
 * @param  {Event} event the triggered event
 * @return {Void}
 */
const loadImage = (event) => {
  const image = event.target;

  // Swap in the srcset info and add an attribute to prevent duplicate loads.
  image.srcset = image.getAttribute('data-lazyload');
  image.setAttribute('data-loaded', true);
};

/**
 * Remove the loading class from the lazyload wrapper.
 * @param  {Element} image        the image being loaded
 * @param  {String}  loadingClass the class to remove
 * @return {Void}
 */
const removeLoadingClass = (image, loadingClass) => {
  let element = image;
  let shouldReturn = false;

  /*
   * Since there may be additional elements wrapping the image (e.g. a link),
   * we run a loop to check the image’s ancestors until we either find the
   * element with the loading class or hit the `body` element.
   */
  while (element.tagName.toLowerCase() !== 'body') {
    if (element.classList.contains(loadingClass)) {
      element.classList.remove(loadingClass);
      shouldReturn = true;
    } else {
      element = element.parentNode;
    }

    if (shouldReturn) {
      return;
    }
  }
};

const checkForImagesToLazyLoad = (lazyLoadEvent, images) => {
  images.forEach((image) => {
    maybeTriggerImageLoad(image, lazyLoadEvent);
  });
};

/**
 * Initializes the lazyloader and adds the relevant classes and handlers.
 * @param  {String}   options.containerClass the lazyloaded image wrapper
 * @param  {String}   options.loadingClass   the class that signifies loading
 * @param  {Function} options.callback       a function to fire on image load
 * @return {Function}                        a function to load visible images
 */
const initialize = ({
  containerClass = 'js--lazyload',
  loadingClass = 'js--lazyload--loading',
  callback = false,
} = {}) => {
  // Find all the containers and add the loading class.
  const containers = document.getElementsByClassName(containerClass);

  [].forEach.call(containers, (container) => {
    container.classList.add(loadingClass);
  });

  // If we get here, `srcset` is supported and we can start processing things.
  const images = [].map.call(containers, findImageElement);

  // Create a custom event to trigger the event load.
  const lazyLoadEvent = new Event('lazyload-init');

  // Attach an onload handler to each image.
  images.forEach((image) => {
    /*
     * Once the image is loaded, we want to remove the loading class so any
     * loading animations or other effects can be disabled.
     */
    image.addEventListener('load', (event) => {
      removeLoadingClass(event.target, loadingClass);

      // If a callback was provided, fire it.
      if (typeof callback === 'function') {
        callback(event);
      }
    });

    /*
     * Set up a listener for the custom event that triggers the image load
     * handler (which loads the image).
     */
    image.addEventListener('lazyload-init', loadImage);

    /*
     * Check if the image is already in the viewport. If so, load it.
     */
    maybeTriggerImageLoad(image, lazyLoadEvent);
  });

  const loadVisibleImages = checkForImagesToLazyLoad.bind(null, lazyLoadEvent, images);

  /*
   * Add an event listener when the page is scrolled. To avoid bogging down the
   * page, we throttle this call to only run every 100ms.
   */
  const scrollHandler = throttle(loadVisibleImages, 100);
  window.addEventListener('scroll', scrollHandler);

  // Return a function to allow manual checks for images to lazy load.
  return loadVisibleImages;
};

/**
 * The public function to initialize lazyloading
 * @param  {Object} config configuration options (see `initialize()`)
 * @return {Function}      a function to manually check for images to lazy load
 */
export function lazyLoadImages(config = {}) {
  // If we have `srcset` support, initialize the lazyloader.
  if ('srcset' in document.createElement('img')) {
    return initialize(config);
  }
}

export default {
  lazyLoadImages,
};
