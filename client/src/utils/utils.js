// Needs binding
export const onScroll = function(cb) {
  return () => {
    /* global pageYOffset, innerHeight */
    let pageYOffset,
      innerHeight,
      docOffsetHeight,
      ticking = false;

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(update);
      }
      ticking = true;
    };

    const update = () => {
      ticking = false;

      const currentPageYOffset = pageYOffset;
      const currentInnerHeight = innerHeight;
      const currentDocOffsetHeight = docOffsetHeight;

      if (
        this.state.showNavToTop === false &&
        currentPageYOffset > currentInnerHeight
      ) {
        this.setState({ showNavToTop: true });
      }
      if (
        this.state.showNavToTop === true &&
        currentPageYOffset < currentInnerHeight
      ) {
        this.setState({ showNavToTop: false });
      }
      if (currentInnerHeight + currentPageYOffset >= currentDocOffsetHeight) {
        cb();
      }
    };

    pageYOffset = window.pageYOffset;
    innerHeight = window.innerHeight;
    docOffsetHeight = document.body.offsetHeight;
    requestTick();
  };
};

export const flattenPages = pages => {
  const slides = [];
  pages.forEach(page => page.forEach(post => slides.push(post)));
  return slides;
};

export const checkIfFirstSlide = index => {
  if (index === 0) {
    return true;
  }
};

export const checkIfLastSlide = (index, slidesLength) => {
  if (index + 1 > slidesLength - 1) {
    return true;
  }
};
