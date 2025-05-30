import { createTag } from '../utils.js';

export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

export function transformLinkToAnimation($a, $videoLooping = true) {
  if (!$a || !$a.href || !$a.href.endsWith('.mp4')) {
    return null;
  }
  const params = new URL($a.href).searchParams;
  const attribs = {};
  const dataAttr = $videoLooping ? ['playsinline', 'autoplay', 'loop', 'muted'] : ['playsinline', 'autoplay', 'muted'];
  dataAttr.forEach((p) => {
    if (params.get(p) !== 'false') attribs[p] = '';
  });
  // use closest picture as poster
  const $poster = $a.closest('div').querySelector('picture source');
  if ($poster) {
    attribs.poster = $poster.srcset;
    $poster.parentNode.remove();
  }
  // replace anchor with video element
  const videoUrl = new URL($a.href);

  const isLegacy = videoUrl.hostname.includes('hlx.blob.core') || videoUrl.hostname.includes('aem.blob.core') || videoUrl.pathname.includes('media_');
  const $video = createTag('video', attribs);
  if (isLegacy) {
    const helixId = videoUrl.hostname.includes('hlx.blob.core') || videoUrl.hostname.includes('aem.blob.core') ? videoUrl.pathname.split('/')[2] : videoUrl.pathname.split('media_')[1].split('.')[0];
    const videoHref = `./media_${helixId}.mp4`;
    $video.innerHTML = `<source src="${videoHref}" type="video/mp4">`;
  } else {
    $video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
  }

  const $innerDiv = $a.closest('div');
  $innerDiv.prepend($video);
  $innerDiv.classList.add('hero-animation-overlay');
  $video.setAttribute('tabindex', 0);
  $a.replaceWith($video);
  // autoplay animation
  $video.addEventListener('canplay', () => {
    $video.muted = true;
    const playPromise = $video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // ignore
      });
    }
  });
  return $video;
}

export function linkImage($elem) {
  const $a = $elem.querySelector('a');
  if ($a) {
    const $parent = $a.closest('div');
    $a.remove();
    $a.className = '';
    $a.innerHTML = '';
    $a.append(...$parent.children);
    $parent.append($a);
  }
}

export function toggleVideo(target) {
  const video = target.closest('.fqa-container').querySelector('video');
  const paused = video ? video.paused : false;

  if (paused) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // ignore
      });
    }
  } else video.pause();
}

export function addAnimationToggle(target) {
  target.addEventListener('click', () => {
    toggleVideo(target);
  }, true);
  target.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter' && e.keyCode !== 32 && e.key !== ' ') {
      return;
    }
    e.preventDefault();
    toggleVideo(target);
  }, true);
}
