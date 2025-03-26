import buildCarousel from '../widgets/carousel.js';
import buildBasicCarousel from '../widgets/basic-carousel.js';
import buildGridCarousel from '../widgets/grid-carousel.js';

function loadCarousel(selector, parent, options) {
  if (parent.closest('.grid-carousel')) {
    return buildGridCarousel(selector, parent, options);
  }
  const useBasicCarousel = parent.closest('.basic-carousel');
  const carouselLoader = useBasicCarousel ? buildBasicCarousel : buildCarousel;
  return carouselLoader(selector, parent, options);
}

export default loadCarousel;
