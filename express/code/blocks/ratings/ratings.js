import { getLibs, getLottie, lazyLoadLottiePlayer, toClassName, getIconElementDeprecated, decorateButtonsDeprecated } from '../../scripts/utils.js';
import BlockMediator from '../../scripts/block-mediator.min.js';
import { splitAndAddVariantsWithDash } from '../../scripts/utils/decorate.js';

let createTag; let getConfig;
let getMetadata;

export default async function decorate(block) {
  splitAndAddVariantsWithDash(block);
  await Promise.all([import(`${getLibs()}/utils/utils.js`), decorateButtonsDeprecated(block)]).then(([utils]) => {
    ({ createTag, getConfig, getMetadata } = utils);
  });

  let submitButtonText;
  let submissionTitle;
  let submissionText;
  let defaultTitle;
  let actionNotUsedText;
  let alreadySubmittedTitle;
  let alreadySubmittedText;
  let votesText;
  let sheet;
  let sheetCamelCase;
  let actionSegments;
  let ratingTotal;
  let ratingAverage;
  let showRatingAverage = false;
  let actionTitle;
  const ratings = [
    {
      class: 'one-star',
      img: getIconElementDeprecated('emoji-angry-face'),
      feedbackRequired: true,
    },
    {
      class: 'two-stars',
      img: getIconElementDeprecated('emoji-thinking-face'),
      feedbackRequired: true,
    },
    {
      class: 'three-stars',
      img: getIconElementDeprecated('emoji-upside-down-face'),
      feedbackRequired: true,
    },
    {
      class: 'four-stars',
      img: getIconElementDeprecated('emoji-smiling-face'),
      feedbackRequired: false,
    },
    {
      class: 'five-stars',
      img: getIconElementDeprecated('emoji-star-struck'),
      feedbackRequired: false,
    },
  ];

  function buildSchema() {
    if (!ratingAverage || !ratingTotal) {
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({
      '@type': 'Product',
      '@context': 'https://schema.org',
      name: document.title,
      description: getMetadata('description'),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingAverage,
        ratingCount: ratingTotal,
      },
    });
    document.head.appendChild(script);
  }

  function hasRated() {
    // dev mode: check use-rating query parameter
    const u = new URL(window.location.href);
    const param = u.searchParams.get('action-rated');
    if (param) {
      if (param === 'true') return true;
      if (param === 'false') return false;
    }

    // "production" mode: check for localStorage
    const ccxActionRatings = localStorage.getItem('ccxActionRatings');
    return ccxActionRatings && ccxActionRatings.includes(sheet);
  }

  function populateStars(count, star, parent) {
    for (let i = 0; i < count; i += 1) {
      parent.appendChild(getIconElementDeprecated(star));
    }
  }

  function determineActionUsed() {
    // "dev" mode: check action-used query parameter
    const u = new URL(window.location.href);
    const param = u.searchParams.get('action-used');
    if (param) {
      if (param === 'true') return true;
      if (param === 'false') return false;
    }

    // "production" mode: check for audience
    const segments = BlockMediator.get('segments');

    if (actionSegments && segments) {
      const parsedActionSegments = actionSegments
        .replace(/ /g, '')
        .split(',')
        .map(Number);
      return parsedActionSegments.some((segment) => segments.includes(segment));
    }

    return false;
  }

  function submitRating(rating, comment) {
    const segments = BlockMediator.get('segments');
    const content = {
      data: [
        {
          name: 'Segments',
          value: segments.length ? segments.join(', ') : '',
        },
        {
          name: 'Locale',
          value: getConfig().locale.region,
        },
        {
          name: 'Rating',
          value: rating,
        },
        {
          name: 'Feedback',
          value: comment,
        },
        {
          name: 'Timestamp',
          value: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        },
      ],
    };

    fetch(`https://www.adobe.com/reviews-api/ccx${sheet}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    let ccxActionRatings = localStorage.getItem('ccxActionRatings') ?? '';

    if (!ccxActionRatings.includes(sheet)) {
      ccxActionRatings = ccxActionRatings.length > 0 ? sheet : `,${sheet}`;
    }

    localStorage.setItem('ccxActionRatings', ccxActionRatings);
  }

  // Updates the front-end style of the slider.
  function updateSliderStyle(value) {
    const $input = block.querySelector('input[type=range]');
    const $tooltip = block.querySelector('.tooltip');
    const $sliderFill = block.querySelector('.slider-fill');
    const thumbWidth = 60;
    const pos = (value - $input.getAttribute('min'))
        / ($input.getAttribute('max') - $input.getAttribute('min'));
    const thumbCorrect = thumbWidth * (pos - 0.25) * -1 - 0.1;
    const titlePos = pos * $input.offsetWidth - thumbWidth / 4 + thumbCorrect;
    $tooltip.style.left = `${titlePos}px`;
    $sliderFill.style.width = `${titlePos + thumbWidth / 2}px`;
  }

  // Implements the slider logic.
  function sliderFunctionality() {
    const input = block.querySelector('input[type=range]');
    const sliderFill = block.querySelector('.slider-fill');
    const tooltip = block.querySelector('.tooltip');
    const tooltipText = block.querySelector('.tooltip--text');
    const tooltipImg = block.querySelector('.tooltip--image');
    const textarea = block.querySelector('.slider-comment textarea');
    const textareaLabel = block.querySelector('.slider-comment label');
    const stars = Array.from(block.querySelectorAll('.stars'));
    const submit = block.querySelector('input[type=submit]');
    const scrollAnchor = block.querySelector('.ratings-scroll-anchor');
    const commentBox = block.querySelector('.slider-comment');
    const timerAnimation = createTag('div', { class: 'timer' });
    // Countdown timer to auto-submit
    const countdown = (bool) => {
      if (bool) {
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
            submit.click();
          }
        }, 920);
      } else if (window.ratingSubmitCountdown) {
        clearInterval(window.ratingSubmitCountdown);
        window.ratingSubmitCountdown = null;
      }
    };
    // Updates the comment box
    const updateCommentBoxAndTimer = () => {
      const val = parseFloat(input.value) ?? 0;
      const index = Math.round(val);
      if (val !== index) return;
      if (ratings[index - 1].feedbackRequired || textarea.value !== '') {
        commentBox.classList.add('submit--appear');
        timerAnimation.remove();
        countdown(false);
      } else {
        commentBox.classList.remove('submit--appear');
        stars[index - 1].parentElement.appendChild(timerAnimation);
        countdown(true);
      }
      commentBox.classList.add('comment--appear');
    };
    // Updates the value of the slider and tooltip.
    const updateSliderValue = (snap = true) => {
      timerAnimation.remove();
      countdown(false);
      let val = parseFloat(input.value) ?? 0;
      const index = Math.round(val);
      if (snap) {
        val = index;
        input.value = index;
        updateCommentBoxAndTimer();
      }
      tooltipText.textContent = ratings[index - 1].text;
      tooltipImg.innerHTML = '';
      tooltipImg.appendChild(ratings[index - 1].img);
      textareaLabel.textContent = ratings[index - 1].textareaLabel;
      textarea.setAttribute('placeholder', ratings[index - 1].textareaInside);
      if (ratings[index - 1].feedbackRequired) {
        textarea.setAttribute('required', 'true');
      } else {
        textarea.removeAttribute('required');
      }
      ratings.forEach((obj) => block.classList.remove(obj.class));
      block.classList.add(ratings[index - 1].class);
      block.classList.add('rated');
      localStorage.setItem(
        `ccxActionRatingsFeedback${sheetCamelCase}`,
        `${input.value},${textarea.value}`,
      );
      updateSliderStyle(input.value);
    };
    // Slider event listeners.
    input.addEventListener('input', () => updateSliderValue(false));
    input.addEventListener('change', () => updateSliderValue());
    let firstTimeInteract = true;
    const scrollToScrollAnchor = () => {
      if (firstTimeInteract) {
        setTimeout(() => {
          scrollAnchor.scrollIntoViewIfNeeded(false);
        }, 450); // Allows for comment slide animation.
        firstTimeInteract = false;
      } else {
        scrollAnchor.scrollIntoViewIfNeeded(false);
      }
    };
    input.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowDown') {
        input.value -= 1;
        updateSliderValue();
        scrollToScrollAnchor();
      } else if (e.code === 'ArrowRight' || e.code === 'ArrowUp') {
        input.value += 1;
        updateSliderValue();
        scrollToScrollAnchor();
      }
    });
    ['mousedown', 'touchstart'].forEach((event) => {
      input.addEventListener(event, () => {
        tooltip.style.transition = 'none';
        sliderFill.style.transition = 'none';
      });
    });
    ['mouseup', 'touchend'].forEach((event) => {
      input.addEventListener(event, () => {
        tooltip.style.transition = 'left .3s, right .3s';
        sliderFill.style.transition = 'width .3s';
        if (
          (!textarea.getAttribute('required') && textarea.value !== '')
          || textarea.value !== ''
        ) {
          submit.focus({ preventScroll: true });
        }
        scrollToScrollAnchor();
      });
    });
    window.addEventListener('resize', () => {
      updateSliderStyle(input.value);
    });
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        input.value = index + 1;
        updateSliderValue();
        scrollToScrollAnchor();
      });
    });
    textarea.addEventListener('focus', () => {
      commentBox.classList.add('submit--appear');
      timerAnimation.remove();
      countdown(false);
    });
    // Get text from localStorage if they navigated away after typing then came back
    textarea.addEventListener('keyup', () => {
      localStorage.setItem(
        `ccxActionRatingsFeedback${sheetCamelCase}`,
        `${input.value},${textarea.value}`,
      );
    });
    const ccxActionRatingsFeedback = localStorage.getItem(
      `ccxActionRatingsFeedback${sheetCamelCase}`,
    );
    if (ccxActionRatingsFeedback) {
      const match = ccxActionRatingsFeedback.match(/([^,]*),((.|\n)*)/);
      const localStorageRating = match[1];
      const localStoragetext = match[2];
      if (localStoragetext && localStoragetext !== '') {
        textarea.value = localStoragetext;
        input.value = localStorageRating;
        commentBox.classList.add('comment--appear');
        updateSliderValue();
      }
    }
  }

  // Gets the current rating and returns star span element.
  function getCurrentRatingStars() {
    const star = getIconElementDeprecated('star');
    const stars = createTag('span', { class: 'rating-stars' });
    let rating = ratingAverage ?? 5;
    rating = Math.round(rating * 10) / 10; // round nearest decimal point
    const ratingAmount = ratingTotal ?? 0;
    const u = new URL(window.location.href);
    const param = u.searchParams.get('show-average');
    if ((showRatingAverage || param === 'true') && param !== 'false') {
      const ratingRoundedHalf = Math.round(rating * 2) / 2;
      const filledStars = Math.floor(ratingRoundedHalf);
      const halfStars = filledStars === ratingRoundedHalf ? 0 : 1;
      const emptyStars = halfStars === 1 ? 4 - filledStars : 5 - filledStars;
      populateStars(filledStars, 'star', stars);
      populateStars(halfStars, 'star-half', stars);
      populateStars(emptyStars, 'star-empty', stars);
      const $votes = createTag('span', { class: 'rating-votes' });
      const strong = document.createElement('strong');
      strong.textContent = `${rating} / 5`;
      $votes.appendChild(strong);
      $votes.appendChild(document.createTextNode(` - ${ratingAmount} ${votesText}`));
      if (getConfig().locale.region === 'kr') {
        $votes.childNodes[0].textContent = `${rating} / 5`;
      }
      stars.appendChild($votes);
      if (rating > 4.2) {
        buildSchema(actionTitle);
      }
    } else {
      for (let i = 0; i < 5; i += 1) {
        stars.appendChild(star.cloneNode(true));
      }
    }
    return stars;
  }

  // Decorates the rating Form and Slider HTML.
  function decorateRatingSlider(title, headingTag = 'h3') {
    const headingWrapper = createTag('div', { class: 'ratings-heading' });
    const heading = createTag(headingTag, { id: toClassName(title) });
    heading.textContent = title;
    headingWrapper.appendChild(heading);
    const stars = getCurrentRatingStars();
    headingWrapper.appendChild(stars);
    block.appendChild(headingWrapper);
    const section = block.closest('.section');
    const form = createTag('form');
    block.appendChild(form);
    const slider = createTag('div', { class: 'slider' });
    form.appendChild(slider);
    const input = createTag('input', {
      type: 'range',
      name: 'rating',
      id: 'rating',
      min: '1',
      max: '5',
      step: '0.001',
      value: '4.5',
      'aria-labelledby': toClassName(title),
    });
    slider.appendChild(input);
    // Initial state of the slider:
    slider.appendChild(createTag('div', { class: 'slider-fill' }));
    slider.insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <div class="tooltip">
        <div>
          <span class="tooltip--text"></span>
          <div class="tooltip--image">
         
          <div>
        </div>
      </div>
    `,
    );
    slider.querySelector('.tooltip--image').append(getIconElementDeprecated('emoji-star-struck'));
    form.insertAdjacentHTML(
      'beforeend',
      /* html */ `
      <div class="slider-bottom">
        <div class="vertical-line"><button type="button" aria-label="1" class="stars one-star"></button></div>
        <div class="vertical-line"><button type="button" aria-label="2" class="stars two-stars"></button></div>
        <div class="vertical-line"><button type="button" aria-label="3" class="stars three-stars"></button></div>
        <div class="vertical-line"><button type="button" aria-label="4" class="stars four-stars"></button></div>
        <div class="vertical-line"><button type="button" aria-label="5" class="stars five-stars"></button></div>
      </div>
      <div class="slider-comment">
        <label for="comment"></label>
        <textarea id="comment" name="comment" rows="4" placeholder=""></textarea>
        <input type="submit" value="${submitButtonText}">
      </div>
      <div class="ratings-scroll-anchor"></div>
    `,
    );
    populateStars(1, 'star', form.querySelector('.one-star'));
    populateStars(2, 'star', form.querySelector('.two-stars'));
    populateStars(3, 'star', form.querySelector('.three-stars'));
    populateStars(4, 'star', form.querySelector('.four-stars'));
    populateStars(5, 'star', form.querySelector('.five-stars'));

    // Form-submit event listener.
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = input.value;
      const comment = form.querySelector('#comment').value;
      submitRating(rating, comment);
      localStorage.removeItem(`ccxActionRatingsFeedback${sheetCamelCase}`);
      block.innerHTML = `
      <${headingTag} id="${toClassName(
  submissionTitle,
)}">${submissionTitle}</${headingTag}>
      <div class="no-slider">
        <p>${submissionText}</p>
      </div>`;
      if (window.scrollY > section.offsetTop) window.scrollTo(0, section.offsetTop - 64);
    });
    sliderFunctionality();
  }

  // Decorate block state when user is not allowed to rate (already rated / hasn't used block)
  function decorateCannotRateBlock(
    title,
    paragraph,
    CTA = null,
    headingTag = 'h3',
  ) {
    const headingWrapper = createTag('div', { class: 'ratings-heading' });
    const heading = createTag(headingTag, { id: toClassName(title) });
    heading.textContent = title;
    headingWrapper.appendChild(heading);
    const stars = getCurrentRatingStars();
    headingWrapper.appendChild(stars);
    block.appendChild(headingWrapper);
    const textAndCTA = createTag('div', { class: 'no-slider' });
    const p = createTag('p');
    p.textContent = paragraph;
    textAndCTA.appendChild(p);
    if (CTA) textAndCTA.appendChild(CTA);
    block.appendChild(textAndCTA);
  }

  // Determine if user is allowed to rate, and then re-decorate the block.
  function regenerateBlockState(title, CTA, headingTag = 'h3') {
    block.innerHTML = '';
    const actionRated = hasRated();
    const actionUsed = determineActionUsed();
    if (actionRated) {
      decorateCannotRateBlock(
        alreadySubmittedTitle,
        alreadySubmittedText,
        null,
        headingTag,
      );
    } else if (actionUsed) {
      decorateRatingSlider(title, headingTag);
    } else {
      decorateCannotRateBlock(title, actionNotUsedText, CTA, headingTag);
    }
  }

  const rows = Array.from(block.children);
  if (!rows[1]) return;

  const classes = block.classList;
  if ((classes.contains('show') && classes.contains('average')) || (classes.contains('show-average'))) showRatingAverage = true;

  const heading = rows[0].querySelector('h1')
      ?? rows[0].querySelector('h2')
      ?? rows[0].querySelector('h3')
      ?? rows[0].querySelector('h4');
  const headingTag = heading ? heading.tagName : 'h3';
  const CTA = rows[0].querySelector('a');
  const $sheet = rows[1].firstElementChild;
  actionTitle = heading ? heading.textContent.trim() : defaultTitle;
  sheet = $sheet.textContent.trim();
  sheetCamelCase = sheet
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
    .replace(/\s+|-+|\/+/g, '');
  block.innerHTML = '';
  lazyLoadLottiePlayer(block);

  regenerateBlockState(actionTitle, CTA, headingTag);

  // When the ratings are retrieved.
  document.addEventListener('ratings_received', () => {
    regenerateBlockState(actionTitle, CTA, headingTag);
    block.classList.add('ratings_received');
  });

  const { env } = getConfig();
  let url = `https://www.adobe.com/reviews-api/ccx${sheet}.json`;
  if (env?.name === 'stage' || env?.name === 'local') {
    url = `https://www.stage.adobe.com/reviews-api/ccx${sheet}.json`;
  }
  const resp = await fetch(url);
  if (resp.ok) {
    const response = await resp.json();
    if (response.data[0].Average) {
      ratingAverage = parseFloat(response.data[0].Average).toFixed(2);
    }
    if (response.data[0].Total) {
      ratingTotal = parseFloat(response.data[0].Total);
    }
    if (response.data[0].Segments) {
      actionSegments = response.data[0].Segments;
    }
    if (ratingAverage || ratingTotal) {
      document.dispatchEvent(new Event('ratings_received'));
    }
  }

  import(`${getLibs()}/features/placeholders.js`).then(async (mod) => {
    ratings[0].text = await mod.replaceKey('one-star-rating', getConfig());
    ratings[0].textareaLabel = await mod.replaceKey('one-star-rating-text', getConfig());
    ratings[0].textareaInside = await mod.replaceKey('one-star-rating-input', getConfig());
    ratings[1].text = await mod.replaceKey('two-star-rating', getConfig());
    ratings[1].textareaLabel = await mod.replaceKey('two-star-rating-text', getConfig());
    ratings[1].textareaInside = await mod.replaceKey('two-star-rating-input', getConfig());
    ratings[2].text = await mod.replaceKey('three-star-rating', getConfig());
    ratings[2].textareaLabel = await mod.replaceKey('three-star-rating-text', getConfig());
    ratings[2].textareaInside = await mod.replaceKey('three-star-rating-input', getConfig());
    ratings[3].text = await mod.replaceKey('four-star-rating', getConfig());
    ratings[3].textareaLabel = await mod.replaceKey('four-star-rating-text', getConfig());
    ratings[3].textareaInside = await mod.replaceKey('four-star-rating-input', getConfig());
    ratings[4].text = await mod.replaceKey('five-star-rating', getConfig());
    ratings[4].textareaLabel = await mod.replaceKey('five-star-rating-text', getConfig());
    ratings[4].textareaInside = await mod.replaceKey('five-star-rating-input', getConfig());
    submitButtonText = await mod.replaceKey('rating-submit', getConfig());
    submissionTitle = await mod.replaceKey('rating-submission-title', getConfig());
    submissionText = await mod.replaceKey('rating-submission-text', getConfig());
    defaultTitle = await mod.replaceKey('rating-default-title', getConfig());
    actionNotUsedText = await mod.replaceKey('rating-action-not-used', getConfig());
    alreadySubmittedTitle = await mod.replaceKey('rating-already-submitted-title', getConfig());
    alreadySubmittedText = await mod.replaceKey('rating-already-submitted-text', getConfig());
    votesText = await mod.replaceKey('rating-votes', getConfig());
    regenerateBlockState(actionTitle, CTA, headingTag);
  });
}
