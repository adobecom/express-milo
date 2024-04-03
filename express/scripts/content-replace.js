export const ORIGINAL_REG = /\{\{(.*?)\}\}/g;
export const SQUARE_REG = /\[\[(.*?)\]\]/g;
let REG = ORIGINAL_REG;

const preserveFormatKeys = [
  'event-description',
];

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return (meta && meta.content) || '';
}

export function yieldToMain() {
  return new Promise((r) => {
    setTimeout(r, 0);
  });
}

function handleRegisterButton(a) {
  const signIn = () => {
    if (typeof window.adobeIMS?.signIn !== 'function') {
      window?.lana.log({ message: 'IMS signIn method not available', tags: 'errorType=warn,module=gnav' });
      return;
    }

    window.adobeIMS.signIn();
  };

  a.addEventListener('click', (e) => {
    e.preventDefault();
    signIn();
  });
}

function autoUpdateLinks(scope) {
  scope.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      const url = new URL(a.href);
      if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
      }

      if (a.href.endsWith('#rsvp-form')) {
        const profile = window.bm8tr.get('imsProfile');
        if (profile?.noProfile) {
          handleRegisterButton(a);
        } else if (!profile) {
          window.bm8tr.subscribe('imsProfile', ({ newValue }) => {
            if (newValue?.noProfile) {
              handleRegisterButton(a);
            }
          });
        }
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}

function updateImgTag(child, matchCallback, parentElement) {
  const parentPic = child.closest('picture');
  const originalAlt = child.alt;
  const replacedSrc = originalAlt.replace(REG, (_match, p1) => matchCallback(_match, p1, child));

  if (replacedSrc && parentPic && replacedSrc !== originalAlt) {
    parentPic.querySelectorAll('source').forEach((el) => {
      try {
        el.srcset = el.srcset.replace(/.*\?/, `${replacedSrc}?`);
      } catch (e) {
        window.lana?.log(`failed to convert optimized picture source from ${el} with dynamic data: ${e}`);
      }
    });

    parentPic.querySelectorAll('img').forEach((el) => {
      const onImgLoad = () => {
        el.removeEventListener('load', onImgLoad);
      };

      try {
        el.src = el.src.replace(/.*\?/, `${replacedSrc}?`);
      } catch (e) {
        window.lana?.log(`failed to convert optimized img from ${el} with dynamic data: ${e}`);
      }

      el.addEventListener('load', onImgLoad);
    });
  } else if (originalAlt.match(REG)) {
    parentElement.remove();
  }
}

function updateTextNode(child, matchCallback) {
  const originalText = child.nodeValue;
  const replacedText = originalText.replace(REG, matchCallback);
  if (replacedText !== originalText) child.nodeValue = replacedText;
}

function swapTokenBrackets(parent) {
  const url = new URLSearchParams(window.location.href);

  const getNewBrackets = (_match) => _match.replace('{{', '[[').replace('}}', ']]');

  if (url.has('use_square_brackets')) {
    const allElements = parent.querySelectorAll('*');
    allElements.forEach((element) => {
      if (element.childNodes.length) {
        element.childNodes.forEach((n) => {
          if (n.tagName === 'IMG' && n.nodeType === 1) {
            updateImgTag(n, getNewBrackets, element);
          }

          if (n.nodeType === 3) {
            updateTextNode(n, getNewBrackets);
          }
        });
      }
    });
    REG = SQUARE_REG;
  }
}

// data -> dom gills
export function autoUpdateContent(parent) {
  swapTokenBrackets(parent);
  if (getMetadata('sheet-powered') !== 'Y') {
    return;
  }
  if (!parent) {
    window.lana?.log('page server block cannot find its parent element');
    return;
  }

  const getContent = (_match, p1, n) => {
    const content = getMetadata(p1) || '';
    if (preserveFormatKeys.includes(p1)) {
      n.parentNode?.classList.add('preserve-format');
    }
    return content;
  };

  const allElements = parent.querySelectorAll('*');

  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((n) => {
        if (n.tagName === 'IMG' && n.nodeType === 1) {
          updateImgTag(n, getContent, element);
        }

        if (n.nodeType === 3) {
          updateTextNode(n, getContent);
        }
      });
    }
  });

  // handle link replacement. To keep when switching to metadata based rendering
  autoUpdateLinks(parent);
}
