// eslint-disable-next-line import/no-unresolved
import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';
import loadCarousel from '../../scripts/utils/load-carousel.js';
import {
  fetchRatingsData,
  createRatingsContainer,
  determineActionUsed,
  hasRated,
  submitRating,
  createRatingSlider,
  sliderFunctionality,
  RATINGS_CONFIG,
} from '../../scripts/utils/ratings-utils.js';

let createTag;
let getConfig;
let loadStyle;

// Initialize utils
import(`${getLibs()}/utils/utils.js`).then((utils) => {
  ({ createTag, getConfig, loadStyle } = utils);
});

function pickRandomFromArray(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

async function createQuotesRatings({
  sheet,
  votesText = 'votes',
}) {
  const data = await fetchRatingsData(sheet);
  if (!data) return null;

  // Check if user can rate and has already rated
  const actionUsed = determineActionUsed(data.segments);
  const alreadyRated = hasRated(sheet);

  // If user can't rate or has already rated, show the ratings container
  if (!actionUsed || alreadyRated) {
    return createRatingsContainer({
      sheet,
      showAverage: true,
      votesText,
    });
  }

  // If user can rate, show the rating slider
  const { container } = await createRatingSlider('Rate this product', 'h3');
  sliderFunctionality(container, {
    sheetCamelCase: sheet,
    ratings: RATINGS_CONFIG,
  });

  // Handle submission via the submit button
  const submit = container.querySelector('input[type=submit]');
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const rating = container.querySelector('input[type=range]').value;
    const comment = container.querySelector('.slider-comment textarea').value;
    submitRating(sheet, rating, comment);
    // Refresh the ratings display
    createQuotesRatings({ sheet, votesText });
  });

  return container;
}

export default async function decorate($block) {
  // Load placeholders module
  const placeholders = await import(`${getLibs()}/features/placeholders.js`);

  addTempWrapperDeprecated($block, 'quotes');

  const isSingularVariant = $block.classList.contains('singular');
  const isCarouselVariant = $block.classList.contains('carousel');
  const hasRatings = $block.classList.contains('ratings');

  if (isSingularVariant) {
    const $rows = [...$block.querySelectorAll(':scope>div')];

    // The Desktop design has a different element layout from the mobile design, plus
    // the desktop design uses the background image twice, while the mobile design uses
    // it once. Because of the many differences, it may be simpler to divide them into two layouts
    const $quoteContainer = createTag('div', { class: 'quote-container' });
    const $desktopContainer = createTag('div', { class: 'desktop-container' });
    const $mobileContainer = createTag('div', { class: 'mobile-container' });
    const $desktopContainerBackground = createTag('div', { class: 'background' });
    const $mobileContainerBackground = createTag('div', { class: 'background' });

    $desktopContainer.append($desktopContainerBackground);
    $mobileContainer.append($mobileContainerBackground);
    $quoteContainer.append($desktopContainer);
    $quoteContainer.append($mobileContainer);

    if ($rows[0].children.length === 1) {
      const $img = $rows[0].children[0].querySelector('img');
      const backgroundUrl = $img.src;

      const backgroundDesktopCSS = `no-repeat calc(-400px + 25%) -20px / 640px url("${backgroundUrl}"), no-repeat calc(450px + 75%) -20px / 640px url("${backgroundUrl}")`;
      $desktopContainerBackground.style.background = backgroundDesktopCSS;

      const backgroundMobileCSS = `no-repeat -80px -48px / 750px url("${backgroundUrl}")`;
      $mobileContainerBackground.style.background = backgroundMobileCSS;

      $rows.shift();
    }

    // at this point, $rows contains only quotes (no param)
    const $quoteSelected = pickRandomFromArray($rows);
    const $picture = $quoteSelected.querySelector('picture');
    const $quoteDesktop = createTag('div', { class: 'quote' });

    $desktopContainer.append($quoteDesktop);

    const $authorPhoto = createTag('div', { class: 'author-photo' });
    $quoteDesktop.append($authorPhoto);

    $authorPhoto.append($picture);

    const $quoteDetails = createTag('div', { class: 'quote-details' });
    $quoteDesktop.append($quoteDetails);

    const $quoteComment = createTag('div', { class: 'quote-comment' });
    $quoteDetails.append($quoteComment);

    const $review = $quoteSelected.children[0];

    $quoteComment.append($review.textContent);

    const authorDescription = $quoteSelected.children[1].textContent;

    const $authorDescription = createTag('div', { class: 'author-description' });
    $quoteDetails.append($authorDescription);

    $authorDescription.append(authorDescription);

    // Mobile layout

    const $quoteMobile = createTag('div', { class: 'quote' });
    $mobileContainer.append($quoteMobile);

    const $quoteDetailsMobile = createTag('div', { class: 'quote-details' });
    $quoteMobile.append($quoteDetailsMobile);

    const $quoteCommentMobile = $quoteComment.cloneNode(true);

    $quoteDetailsMobile.append($quoteCommentMobile);

    const $quoteAuthorPanelMobile = createTag('div', { class: 'author-panel' });
    $quoteDetailsMobile.append($quoteAuthorPanelMobile);

    const $quoteAuthorPhotoMobile = createTag('div', { class: 'author-photo' });
    $quoteAuthorPanelMobile.append($quoteAuthorPhotoMobile);

    const $pictureCloned = $picture.cloneNode(true);

    $quoteAuthorPhotoMobile.append($pictureCloned);
    $quoteAuthorPanelMobile.append(authorDescription);

    $block.replaceChildren($quoteContainer);
  } else if (isCarouselVariant) {
    // Extract ratings data source if present
    let ratingsDataSource;
    const $rows = [...$block.querySelectorAll(':scope>div')];

    // Only look for ratings data if first div contains text and no h2
    if (hasRatings
        && $rows[0]?.firstElementChild?.textContent
        && !$rows[0].querySelector('h2')) {
      ratingsDataSource = $rows[0].firstElementChild.textContent.trim();
      $rows.shift(); // Remove the ratings data source row
      // const config = getConfig();
      // loadStyle(`${config.codeRoot}/blocks/ratings/ratings.css`); // Load ratings CSS when ratings are present
    }

    // Extract heading if present (should be the first or second row)
    const [$headingRow] = $rows.filter((row) => row.querySelector('h2'));
    if ($headingRow) {
      const headingIndex = $rows.indexOf($headingRow);
      $rows.splice(headingIndex, 1); // Remove the heading row from its position
    }

    // Create ratings container if needed
    let $ratingsContainer;
    if (hasRatings && ratingsDataSource) {
      $ratingsContainer = await createQuotesRatings({
        sheet: ratingsDataSource,
        votesText: await placeholders.replaceKey('rating-votes', getConfig()),
      });
    }

    // Create carousel container
    const $carouselContainer = createTag('div', { class: 'basic-carousel' });

    // Process each quote into a carousel item
    $rows.forEach(($card) => {
      $card.classList.add('template', 'basic-carousel-element', 'quote');
      if ($card.children.length > 1) {
        const $author = $card.children[1];
        $author.classList.add('author');
        const $authorContent = createTag('div', { class: 'author-content' });

        if ($author.querySelector('picture')) {
          const $authorImg = createTag('div', { class: 'image' });
          $authorImg.appendChild($author.querySelector('picture'));
          $authorContent.appendChild($authorImg);
        }

        const $authorSummary = createTag('div', { class: 'summary' });
        Array.from($author.querySelectorAll('p'))
          .filter(($p) => !!$p.textContent.trim())
          .forEach(($p) => $authorSummary.appendChild($p));
        $authorContent.appendChild($authorSummary);
        $author.appendChild($authorContent);
      }
      $card.firstElementChild.classList.add('content');

      $carouselContainer.appendChild($card);
    });

    // Initialize the carousel after ensuring CSS is loaded
    const config = getConfig();
    await new Promise((resolve) => {
      loadStyle(`${config.codeRoot}/scripts/widgets/basic-carousel.css`, () => {
        resolve();
      });
    });
    await loadCarousel(null, $carouselContainer);

    // Create a wrapper to hold everything
    const $wrapper = createTag('div', { class: 'quotes-ratings-wrapper' });

    // Create headline wrapper for heading and ratings
    if ($headingRow || $ratingsContainer) {
      const $headlineWrapper = createTag('div', { class: 'container' });
      if ($headingRow) {
        $headlineWrapper.appendChild($headingRow);
      }
      if ($ratingsContainer) {
        $headlineWrapper.appendChild($ratingsContainer);
      }
      $wrapper.appendChild($headlineWrapper);
    }

    $wrapper.appendChild($carouselContainer);

    // Replace block content with wrapper containing headline and carousel
    $block.replaceChildren($wrapper);
  } else {
    $block.querySelectorAll(':scope>div').forEach(($card) => {
      $card.classList.add('quote');
      if ($card.children.length > 1) {
        const $author = $card.children[1];
        $author.classList.add('author');
        // Create a container for image and summary
        const $authorContent = createTag('div', { class: 'author-content' });

        if ($author.querySelector('picture')) {
          const $authorImg = createTag('div', { class: 'image' });
          $authorImg.appendChild($author.querySelector('picture'));
          $authorContent.appendChild($authorImg);
        }

        const $authorSummary = createTag('div', { class: 'summary' });
        Array.from($author.querySelectorAll('p'))
          .filter(($p) => !!$p.textContent.trim())
          .forEach(($p) => $authorSummary.appendChild($p));
        $authorContent.appendChild($authorSummary);
        // Append the author content container to author
        $author.appendChild($authorContent);
      }
      $card.firstElementChild.classList.add('content');
    });
  }
}
