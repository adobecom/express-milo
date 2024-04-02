import { getLibs } from '../utils.js';

const { loadScript, loadStyle, createTag, getConfig } = await import(
  `${getLibs()}/utils/utils.js`
);

export const getAvailableVimeoSubLang = () => {
  const langs = {
    fr: 'fr',
    de: 'de',
    jp: 'ja',
  };
  return langs[getConfig().locale.prefix.replace('/', '')] || 'en';
};

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

export function isVideoLink(url) {
  if (!url) return null;
  return url.includes('youtube.com/watch')
    || url.includes('youtu.be/')
    || url.includes('vimeo')
    || /.*\/media_.*(mp4|webm|m3u8)$/.test(new URL(url).pathname);
}
