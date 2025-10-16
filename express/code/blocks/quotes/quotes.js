// eslint-disable-next-line import/no-unresolved
import { getLibs, addTempWrapperDeprecated, getLottie, lazyLoadLottiePlayer, toClassName } from '../../scripts/utils.js';
import loadCarousel from '../../scripts/utils/load-carousel.js';
import {
  fetchRatingsData,
  determineActionUsed,
  hasRated,
  submitRating,
  createRatingSlider,
  sliderFunctionality,
  RATINGS_CONFIG,
  createHoverStarRating,
  createRatingsContainer,
} from '../../scripts/utils/ratings-utils.js';

let createTag;
let getConfig;
let loadStyle;

// Initialize utils
let utils;
try {
  utils = await import(`${getLibs()}/utils/utils.js`);
  ({ createTag, getConfig, loadStyle } = utils);
} catch (error) {
  window.lana?.log('Failed to load utils:', error, { tags: 'ax quotes' });
  throw error;
}

function pickRandomFromArray(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

function createQuoteContent(textContent, addContentClass = false) {
  const $blockquote = createTag('blockquote', { class: addContentClass ? 'content' : '' });
  const $p = createTag('p', { class: 'inner-content' });
  $p.textContent = textContent;
  $blockquote.appendChild($p);
  return $blockquote;
}

function createAuthorContent($author) {
  const $authorContent = createTag('div', { class: 'author-content' });

  const $picture = $author.querySelector('picture');
  if ($picture) {
    const $authorImg = createTag('div', { class: 'image' });
    $authorImg.appendChild($picture);
    $authorContent.appendChild($authorImg);
  }

  const $authorSummary = createTag('div', { class: 'summary' });
  Array.from($author.querySelectorAll('p'))
    .filter(($p) => !!$p.textContent.trim())
    .forEach(($p) => $authorSummary.appendChild($p));

  $authorContent.appendChild($authorSummary);
  $author.appendChild($authorContent);

  return $authorContent;
}

async function createQuotesRatings({
  sheet,
  isCarouselVariant = false,
}) {
  // Load placeholders module
  const placeholders = await import(`${getLibs()}/features/placeholders.js`);

  const data = await fetchRatingsData(sheet);
  if (!data) return null;

  // Check if user can rate and has already rated
  const actionUsed = determineActionUsed(data.segments);
  const alreadyRated = hasRated(sheet);

  // Create a wrapper for the rating interface
  const wrapper = createTag('div', { class: 'ratings' });

  // Ensure Lottie player is loaded before proceeding
  await lazyLoadLottiePlayer(wrapper);

  // If user can't rate yet, show the ratings container with stars and vote count
  if (!actionUsed) {
    const ratingsContainer = await createRatingsContainer({
      sheet,
      showAverage: true,
      votesText: await placeholders.replaceKey('rating-votes', getConfig()),
    });
    wrapper.appendChild(ratingsContainer);
    return wrapper;
  }

  // If user has already rated, show the "already rated" state
  /* c8 ignore next */
  if (alreadyRated) {
    const [
      alreadySubmittedTitle,
      alreadySubmittedText,
    ] = await Promise.all([
      placeholders.replaceKey('rating-already-submitted-title', getConfig()),
      placeholders.replaceKey('rating-already-submitted-text', getConfig()),
    ]);

    const thankYouContainer = createTag('div', { class: 'no-slider' });
    const title = createTag('h3', { id: toClassName(alreadySubmittedTitle) });
    title.textContent = alreadySubmittedTitle;
    const message = createTag('p');
    message.textContent = alreadySubmittedText;
    thankYouContainer.appendChild(title);
    thankYouContainer.appendChild(message);
    wrapper.appendChild(thankYouContainer);
    wrapper.classList.add('submitted');
    return wrapper;
  }

  // Load all placeholder text
  const [
    submissionTitle,
    submissionText,
  ] = await Promise.all([
    placeholders.replaceKey('rating-submission-title', getConfig()),
    placeholders.replaceKey('rating-submission-text', getConfig()),
  ]);

  // Create the rating interface based on variant
  /* c8 ignore next */
  if (isCarouselVariant) {
    // Use hover-based rating for carousel variant
    const hoverRating = await createHoverStarRating({
      ratings: RATINGS_CONFIG,
      onRatingSelect: async (rating) => {
        // Create a single timer instance at the hover rating level
        const timerAnimation = createTag('div', { class: 'timer' });

        // Countdown function to manage the timer
        const countdown = (bool, ratingValue) => {
          if (bool) {
            // Remove any existing timer
            const existingTimer = hoverRating.querySelector('.timer');
            if (existingTimer) {
              existingTimer.remove();
            }

            // Add timer to current star element
            const currentStar = hoverRating.querySelector(`[data-rating="${ratingValue}"]`);
            const hoverStars = hoverRating.querySelector('.hover-stars');
            if (currentStar && hoverStars) {
              hoverStars.appendChild(timerAnimation);
            }

            timerAnimation.innerHTML = getLottie(
              'countdown',
              '/express/code/blocks/ratings/countdown.json',
              false,
              true,
              false,
              false,
            );

            let counter = 10;
            window.ratingSubmitCountdown = setInterval(() => {
              if (counter > 0) {
                counter -= 1;
              } else {
                clearInterval(window.ratingSubmitCountdown);
                window.ratingSubmitCountdown = null;
                const submit = hoverRating.querySelector('input[type="submit"]');
                if (submit) {
                  submit.click();
                }
              }
            }, 920);
          } else if (window.ratingSubmitCountdown) {
            clearInterval(window.ratingSubmitCountdown);
            window.ratingSubmitCountdown = null;
            timerAnimation.remove();
          }
        };

        // Function to clean up previous rating state
        const cleanupPreviousRating = () => {
          // Clear any existing timer
          countdown(false);
        };

        // Clean up previous rating state
        cleanupPreviousRating();

        // Wait for the next tick to ensure the comment box is in the DOM
        await Promise.resolve();

        // Get the comment box and its elements
        const commentBox = hoverRating.querySelector('.slider-comment');
        if (!commentBox) return;

        const textarea = commentBox.querySelector('textarea');
        const submit = commentBox.querySelector('input[type="submit"]');

        // Add invalid class handling
        textarea.addEventListener('invalid', (e) => {
          e.preventDefault();
          textarea.classList.add('invalid');
        });

        textarea.addEventListener('input', () => {
          if (textarea.value !== '') {
            countdown(false);
            textarea.classList.remove('invalid');
          }
        });

        // Handle submission
        let isSubmitting = false;
        const handleSubmit = async (e) => {
          e.preventDefault();
          if (isSubmitting) return;

          // Check if textarea is required and empty
          if (textarea.required && !textarea.value.trim()) {
            textarea.classList.add('invalid');
            return;
          }

          isSubmitting = true;
          const comment = textarea.value;
          await submitRating(sheet, rating, comment);
          localStorage.removeItem(`ccxActionRatingsFeedback${sheet}`);

          // Show thank you message immediately after submission
          const thankYouContainer = createTag('div', { class: 'no-slider' });
          const title = createTag('h3', { id: toClassName(submissionTitle) });
          title.textContent = submissionTitle;
          const message = createTag('p');
          message.textContent = submissionText;
          thankYouContainer.appendChild(title);
          thankYouContainer.appendChild(message);

          // Replace the ratings interface with thank you message
          wrapper.innerHTML = '';
          wrapper.appendChild(thankYouContainer);
          wrapper.classList.add('submitted');

          // Scroll to top of section if needed
          const section = wrapper.closest('.section');
          if (window.scrollY > section.offsetTop) {
            window.scrollTo(0, section.offsetTop - 64);
          }
        };
        submit.addEventListener('click', handleSubmit);

        // Start countdown if feedback not required
        const ratingConfig = RATINGS_CONFIG[rating - 1];
        if (!ratingConfig.feedbackRequired) {
          countdown(true, rating);
        }

        // Add event listeners for timer control
        textarea.addEventListener('focus', () => {
          countdown(false);
        });
      },
    });
    wrapper.appendChild(hoverRating);
  } else {
    // Use existing slider for other variants
    const { container } = await createRatingSlider('', 'h3');
    sliderFunctionality(container, {
      sheetCamelCase: sheet,
      ratings: RATINGS_CONFIG,
    });
    wrapper.appendChild(container);
  }

  return wrapper;
}

export default async function decorate($block) {
  addTempWrapperDeprecated($block, 'quotes');
  lazyLoadLottiePlayer($block);

  const isSingularVariant = $block.classList.contains('singular');
  const isCarouselVariant = $block.classList.contains('carousel');
  const hasRatings = $block.classList.contains('ratings');

  if (isSingularVariant) {
    const $rows = [...$block.querySelectorAll(':scope>div')];

    // Only create the container for the active device (mobile or desktop)
    // This reduces DOM size and avoids rendering hidden elements
    const deviceType = document.body.getAttribute('data-device');
    const isMobile = deviceType === 'mobile';

    const $quoteContainer = createTag('div', { class: 'quote-container' });
    const $container = createTag('div', { class: isMobile ? 'mobile-container' : 'desktop-container' });
    const $containerBackground = createTag('div', { class: 'background' });

    $container.append($containerBackground);
    $quoteContainer.append($container);

    if ($rows[0].children.length === 1) {
      const $img = $rows[0].children[0].querySelector('img');
      const backgroundUrl = $img.src;

      // Store background URL in data attribute for lazy loading
      // Desktop: Keep original positioning but use single image (remove duplicate)
      // Mobile: Keep original positioning
      const backgroundCSS = isMobile
        ? `no-repeat -80px -48px / 750px url("${backgroundUrl}")`
        : `no-repeat calc(-400px + 25%) -20px / 640px url("${backgroundUrl}")`;
      $containerBackground.setAttribute('data-background', backgroundCSS);

      // Lazy load background using Intersection Observer
      const lazyLoadBackground = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const background = element.getAttribute('data-background');
            if (background) {
              element.style.background = background;
              element.removeAttribute('data-background');
            }
            observer.unobserve(element);
          }
        });
      };

      const observer = new IntersectionObserver(lazyLoadBackground, {
        rootMargin: '50px', // Start loading 50px before entering viewport
      });

      observer.observe($containerBackground);

      $rows.shift();
    }

    // at this point, $rows contains only quotes (no param)
    const $quoteSelected = pickRandomFromArray($rows);
    const $picture = $quoteSelected.querySelector('picture');
    const authorDescription = $quoteSelected.children[1].textContent;

    const $quote = createTag('div', { class: 'quote' });
    $container.append($quote);

    const $quoteDetails = createTag('div', { class: 'quote-details' });
    $quote.append($quoteDetails);

    const $quoteComment = createTag('div', { class: 'quote-comment' });
    $quoteDetails.append($quoteComment);

    $quoteComment.append(createQuoteContent(
      $quoteSelected.firstElementChild.textContent,
    ));

    if (isMobile) {
      // Mobile layout: author-panel with photo and description
      const $quoteAuthorPanel = createTag('div', { class: 'author-panel' });
      $quoteDetails.append($quoteAuthorPanel);

      const $quoteAuthorPhoto = createTag('div', { class: 'author-photo' });
      $quoteAuthorPanel.append($quoteAuthorPhoto);

      $quoteAuthorPhoto.append($picture);
      $quoteAuthorPanel.append(authorDescription);
    } else {
      // Desktop layout: author-photo before quote-details
      const $authorPhoto = createTag('div', { class: 'author-photo' });
      $quote.insertBefore($authorPhoto, $quoteDetails);

      $authorPhoto.append($picture);

      const $authorDescription = createTag('div', { class: 'author-description' });
      $quoteDetails.append($authorDescription);

      $authorDescription.append(authorDescription);
    }

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
        isCarouselVariant: true,
      });
    }

    // Create carousel container
    const $carouselContainer = createTag('div', {
      class: `basic-carousel${hasRatings ? ' carousel-play-pause' : ''}`,
    });

    // Process each quote into a carousel item
    $rows.forEach(($card) => {
      $card.classList.add('template', 'basic-carousel-element', 'quote');
      if ($card.children.length > 1) {
        const $author = $card.children[1];
        $author.classList.add('author');
        createAuthorContent($author);
      }

      const $blockquote = createQuoteContent($card.firstElementChild.textContent, true);
      $card.firstElementChild.replaceWith($blockquote);
      // Move author before content
      if ($card.children.length > 1) {
        $card.insertBefore($card.children[1], $card.firstElementChild);
      }

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
        createAuthorContent($author);
      }

      const $blockquote = createQuoteContent($card.firstElementChild.textContent, true);
      $card.firstElementChild.replaceWith($blockquote);
    });
  }
}
