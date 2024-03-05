import { getLibs } from '../utils.js';
let { createTag } = await import(`${getLibs()}/utils/utils.js`)
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
    if (!$a || !$a.href.endsWith('.mp4')) {
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
    const helixId = videoUrl.hostname.includes('hlx.blob.core') ? videoUrl.pathname.split('/')[2] : videoUrl.pathname.split('media_')[1].split('.')[0];
    const videoHref = `./media_${helixId}.mp4`;
    const $video = createTag('video', attribs);
    $video.innerHTML = `<source src="${videoHref}" type="video/mp4">`;
    const $innerDiv = $a.closest('div');
    $innerDiv.prepend($video);
    $innerDiv.classList.add('hero-animation-overlay');
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
