import buildCarousel from '../widgets/carousel.js';
import buildBasicCarousel from '../widgets/basic-carousel.js';

function loadCarousel(selector, parent, options) {
  const useBasicCarousel = parent.closest('.basic-carousel');
  const carouselLoader = useBasicCarousel ? buildBasicCarousel : buildCarousel;
  return carouselLoader(selector, parent, options);
}

export default loadCarousel;
