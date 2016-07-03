/**
 * Check if an element is visible at all in the viewport.
 * @param  {Element} el the element to check
 * @return {Boolean}    `true` if the element is visible at all; `false` if not
 */
function isElementVisible(el) {
  const position = el.getBoundingClientRect();
  const wHeight = window.innerHeight || document.documentElement.clientHeight;

  return (
    (position.top >= 0 && position.top <= wHeight) ||
    (position.bottom >= 0 && position.bottom <= wHeight)
  );
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
      setTimeout(() => { wait = false; }, limit);
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
  if (!image.dataset.loaded && isElementVisible(image)) {
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
const findImageElement = container => {
  if (container.tagName.toLowerCase() === 'img') {
    return container;
  } else {
    return container.querySelector('img');
  }
};

/**
 * This almost seems too easy, but we simply swap in the correct srcset.
 * @param  {Event} event the triggered event
 * @return {Void}
 */
const loadImage = event => {
  event.target.srcset = event.target.dataset.lazyload;

  // Add a `data-loaded` attribute to prevent duplicate loads.
  event.target.dataset.loaded = true;
};

/**
 * Remove the loading class from the container element.
 * @param  {Element} image        the image being loaded
 * @param  {String}  loadingClass the class to remove
 * @return {Void}
 */
const removeLoadingClass = (image, loadingClass) => {
  image.parentNode.classList.remove(loadingClass);
};

/**
 * Check if the browser supports `srcset`.
 * @return {Boolean} `true` if supported; `false` if not
 */
const hasSrcsetSupport = () => {
  return 'srcset' in document.createElement('img');
};

/**
 * Initializes the lazyloader and adds all relevant handlers.
 * @param  {String} options.containerClass the container for images to lazyload
 * @param  {String} options.loadingClass   the loading class for lazyloading
 * @return {Void}
 */
export function lazyLoadImages({
  containerClass = "js--lazyload",
  loadingClass = "js--lazyload--loading",
  callback = () => {},
} = {}) {
  const containers = document.getElementsByClassName(containerClass);

  // Before we do anything, check if the browser supports `srcset`
  if (!hasSrcsetSupport()) {

    // If not, remove the loading class and bail out.
    for (let container of containers) {
      removeLoadingClass(container, loadingClass);
    }

    return false;
  }

  // If we get here, `srcset` is supported and we can start processing things.
  const images = [].map.call(containers, findImageElement);

  // Create a custom event to trigger the event load.
  const lazyLoadEvent = new Event('lazyload-init');

  // Attach an onload handler to each image.
  images.forEach(image => {

    /*
     * Once the image is loaded, we want to remove the loading class so any
     * loading animations or other effects can be disabled.
     */
    image.addEventListener('load', event => {
      removeLoadingClass(event.target, loadingClass);
      callback(event);
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

  /*
   * Add an event listener when the page is scrolled. To avoid bogging down the
   * page, we throttle this call to only run every 100ms.
   */
  const scrollHandler = throttle(() => {
    images.forEach(image => {
      maybeTriggerImageLoad(image, lazyLoadEvent);
    });
  }, 100);
  window.addEventListener('scroll', scrollHandler);
}
