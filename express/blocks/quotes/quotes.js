// eslint-disable-next-line import/no-unresolved
import { getLibs } from '../../scripts/utils.js';
import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function pickRandomFromArray(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

export default function decorate($block) {
  addTempWrapperDeprecated($block, 'quotes');

  const isSingularVariant = $block.classList.contains('singular');

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
