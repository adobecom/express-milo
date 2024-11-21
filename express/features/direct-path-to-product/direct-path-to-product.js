/* global _satellite */
import { getLibs } from '../../scripts/utils.js';
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';

// eslint-disable-next-line import/no-cycle
import { getProfile, getDestination } from '../../scripts/express-delayed.js';

const { createTag, getConfig, loadStyle } = await import(`${getLibs()}/utils/utils.js`);

const OPT_OUT_KEY = 'no-direct-path-to-product';

const adobeEventName = 'adobe.com:express:cta:pep';

const REACT_TIME = 4000;

function track(name) {
  try {
    _satellite?.track('event', {
      xdm: {},
      data: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            name,
            linkClicks: { value: 1 },
            type: 'other',
          },
        },
        _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName: name } } } },
      },
    });
  } catch (e) {
    window.lana.log(e);
  }
}

function buildProfileWrapper(profile) {
  const profileWrapper = createTag('div', { class: 'profile-wrapper' });
  const profilePhotoCont = createTag('div', { class: 'profile-img-container' });
  const profilePhoto = createTag('img', { src: profile.avatar });
  const profileTextWrapper = createTag('div', { class: 'profile-text-wrapper' });
  const profileName = createTag('strong', { class: 'profile-name' }, profile.display_name);
  const profileEmail = createTag('span', { class: 'profile-email' }, profile.email);
  profilePhotoCont.append(profilePhoto);
  profileWrapper.append(profilePhotoCont, profileTextWrapper);
  profileTextWrapper.append(profileName, profileEmail);
  return profileWrapper;
}

export default async function loadLoginUserAutoRedirect() {
  let cancel = false;
  const [mod] = await Promise.all([
    import(`${getLibs()}/features/placeholders.js`),
    new Promise((resolve) => {
      loadStyle('/express/features/direct-path-to-product/direct-path-to-product.css', resolve);
    }),
  ]);

  const buildRedirectAlert = async () => {
    const container = createTag('div', { class: 'pep-container' });
    const headerWrapper = createTag('div', { class: 'pep-header' });
    const headerIcon = createTag('div', { class: 'pep-header-icon' }, getIconElementDeprecated('cc-express'));
    const headerText = createTag('span', { class: 'pep-header-text' }, mod.replaceKey('pep-header', getConfig()));
    const progressBg = createTag('div', { class: 'pep-progress-bg' });
    const progressBar = createTag('div', { class: 'pep-progress-bar' });
    const noticeWrapper = createTag('div', { class: 'notice-wrapper' });
    const noticeText = createTag('span', { class: 'notice-text' }, mod.replaceKey('pep-cancel', getConfig()));
    const noticeBtn = createTag('button', { class: 'notice-btn', tabIndex: '1' }, mod.replaceKey('cancel', getConfig()));

    headerWrapper.append(headerIcon, headerText);
    progressBg.append(progressBar);
    noticeWrapper.append(noticeText, noticeBtn);
    container.append(headerWrapper, progressBg);
    const profile = await getProfile();
    if (profile) {
      container.append(buildProfileWrapper(profile));
    }
    container.append(noticeWrapper);

    const header = document.querySelector('header');
    header.append(container);
    const handleTab = (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        noticeBtn.focus();
        document.removeEventListener('keydown', handleTab);
      }
    };
    document.addEventListener('keydown', handleTab);

    noticeBtn.addEventListener('click', () => {
      track(`${adobeEventName}:cancel`);
      container.remove();
      document.removeEventListener('keydown', handleTab);
      cancel = true;
      localStorage.setItem(OPT_OUT_KEY, '3');
    });
    return { container, noticeBtn };
  };

  const optOutCounter = localStorage.getItem(OPT_OUT_KEY);

  if (optOutCounter && optOutCounter !== '0') {
    const counterNumber = parseInt(optOutCounter, 10);
    localStorage.setItem(OPT_OUT_KEY, (counterNumber - 1).toString());
  } else {
    const { container, noticeBtn } = await buildRedirectAlert();
    let startTime = performance.now();
    let remainTime = REACT_TIME;
    let timeoutId;
    let [hovering, focusing] = [false, false];
    const progressBar = container.querySelector('.pep-progress-bar');
    let start;
    const pause = () => {
      clearTimeout(timeoutId);
      const pastTime = performance.now() - startTime;
      remainTime -= pastTime;
      const progress = Math.min(100, ((REACT_TIME - remainTime) / REACT_TIME) * 100);
      progressBar.style.transition = 'none';
      progressBar.style.width = `${progress}%`;
    };
    const resume = () => {
      timeoutId = start();
    };
    const mouseEnter = () => {
      hovering = true;
      if (focusing) return;
      pause();
    };
    const mouseLeave = () => {
      hovering = false;
      if (focusing) return;
      resume();
    };
    const focusIn = () => {
      focusing = true;
      if (hovering) return;
      pause();
    };
    const focusOut = () => {
      focusing = false;
      if (hovering) return;
      resume();
    };
    start = () => {
      startTime = performance.now();
      progressBar.style.transition = `width ${remainTime}ms linear`;
      // eslint-disable-next-line chai-friendly/no-unused-expressions
      progressBar.offsetWidth; // forcing a reflow to get more consistent transition
      progressBar.style.width = '100%';
      return setTimeout(() => {
        container.removeEventListener('mouseenter', mouseEnter);
        container.removeEventListener('mouseleave', mouseLeave);
        noticeBtn.removeEventListener('focusin', focusIn);
        noticeBtn.removeEventListener('focusout', focusOut);
        if (!cancel) {
          container.classList.add('done');
          track(`${adobeEventName}:redirect`);
          window.location.assign(getDestination());
          container.remove();
        }
      }, remainTime);
    };
    noticeBtn.addEventListener('focusin', focusIn);
    noticeBtn.addEventListener('focusout', focusOut);
    container.addEventListener('mouseenter', mouseEnter);
    container.addEventListener('mouseleave', mouseLeave);
    timeoutId = start();
  }
}
