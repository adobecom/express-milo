import { getLibs } from './utils.js';
import { getAvailableVimeoSubLang } from './widgets/video.js';

const { createTag, loadScript, loadStyle } = await import(`${getLibs()}/utils/utils.js`);

export function getDefaultEmbed(url) {
  return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;
}

export function embedYoutube(url) {
  const title = !url.href.includes('http') ? url : 'Youtube Video';
  const searchParams = new URLSearchParams(url.search);
  const id = searchParams.get('v') || url.pathname.split('/').pop();
  searchParams.delete('v');
  loadScript('/express/scripts/libs/lite-yt-embed/lite-yt-embed.js', 'module');
  loadStyle('/express/scripts/libs/lite-yt-embed/lite-yt-embed.css');

  return createTag('lite-youtube', {
    videoid: id,
    playlabel: title,
  });
}

export function embedVimeo(url, thumbnail) {
  const wrapper = createTag('div', { class: 'embed-vimeo' });
  const thumbnailLink = thumbnail?.querySelector('img')?.src;
  const src = url.href;
  const language = getAvailableVimeoSubLang();
  if (url.hostname !== 'player.vimeo.com') {
    loadScript('/express/scripts/libs/lite-vimeo-embed/lite-vimeo-embed.js', 'module');
    loadStyle('/express/scripts/libs/lite-vimeo-embed/lite-vimeo-embed.css');
    const video = url.pathname.split('/')[1];
    const embed = createTag('lite-vimeo', {
      videoid: video,
      src,
      thumbnail: thumbnailLink,
      language,
    });
    wrapper.append(embed);
  }
  return wrapper;
}

export function embedInstagram(url) {
  const location = window.location.href;
  const src = `${url.origin}${url.pathname}${url.pathname.charAt(url.pathname.length - 1) === '/' ? '' : '/'}embed/?cr=1&amp;v=13&amp;wp=1316&amp;rd=${location.endsWith('.html') ? location : `${location}.html`}`;
  const embedHTML = `<div style="width: 100%; position: relative; padding-bottom: 56.25%; display: flex; justify-content: center">
    <iframe class="instagram-media instagram-media-rendered" id="instagram-embed-0" src="${src}"
      allowtransparency="true" allowfullscreen="true" frameborder="0" height="530" style="background: white; border-radius: 3px; border: 1px solid rgb(219, 219, 219);
      box-shadow: none; display: block;">
    </iframe>
  </div>`;
  return embedHTML;
}

export function embedSpark(url) {
  let embedURL = url;
  if (!url.pathname.endsWith('/embed.html') && !url.pathname.endsWith('/embed')) {
    embedURL = new URL(`${url.href}${url.pathname.endsWith('/') ? '' : '/'}embed.html`);
  }

  return getDefaultEmbed(embedURL);
}

export function embedTwitter(url) {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
}
