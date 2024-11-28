import { getLibs } from '../../scripts/utils.js';
import { fixIcons } from '../../scripts/utils/icons.js';

let getConfig; let replaceKey;

export default async function decorate($block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ getConfig } = utils);
    ({ replaceKey } = placeholders);
  });
  fixIcons($block);
  const $form = document.createElement('form');
  const $formHeading = document.createElement('h2');
  $formHeading.textContent = 'Subscribe now.';
  $formHeading.classList.add('form-heading');

  const $submitButton = document.createElement('a');
  const $emailInput = document.createElement('input');
  $emailInput.classList.add('email-input');
  $emailInput.setAttribute('type', 'email');
  $emailInput.setAttribute('placeholder', 'Email');
  $emailInput.addEventListener('keydown', (e) => {
    $emailInput.classList.remove('error');
    const key = e.key || e.keyCode;
    if (key === 13 || key === 'Enter') {
      e.preventDefault();
      $submitButton.click();
    }
  });

  replaceKey('subscribe-cta', getConfig()).then((text) => { $submitButton.textContent = text; });

  $submitButton.setAttribute('href', '');
  $submitButton.classList.add('button');
  $submitButton.classList.add('accent');
  $submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const email = $emailInput.value;

    if (email && $form.checkValidity()) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const body = {
        sname: 'adbemeta_live',
        email,
        consent_notice: '<div class="disclaimer detail-spectrum-m" style="letter-spacing: 0px; padding-top: 15px;">The Adobe family of companies may keep me informed with personalized emails about the Adobe x Meta Express your brand campaign. See our <a href="https://www.adobe.com/privacy/policy.html" target="_blank">Privacy Policy</a> for more details or to opt-out at any time.</div>',
        current_url: window.location.href,
      };

      const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      };

      fetch('https://www.adobe.com/api2/subscribe_v1', requestOptions)
        .then(() => {
          $formHeading.textContent = 'Thanks for signing up!';
          $formHeading.classList.add('success');
          $formHeading.classList.remove('error');
          $emailInput.classList.remove('error');
          $emailInput.value = '';
        })
        .catch(() => {
          $formHeading.textContent = 'An error occurred during subscription';
          $formHeading.classList.add('error');
        });
    } else {
      $emailInput.classList.add('error');
      $form.reportValidity();
    }
  });

  $block.querySelector('.submit-email > div > div').appendChild($form);

  const $formBlock = document.createElement('div');
  $formBlock.classList.add('form-block');
  $formBlock.appendChild($emailInput);
  $formBlock.appendChild($submitButton);
  $form.appendChild($formHeading);
  $form.appendChild($formBlock);

  // Change p to spans
  for (const p of $block.querySelectorAll('p')) {
    const span = document.createElement('span');
    span.innerHTML = p.innerHTML;
    p.parentNode.replaceChild(span, p);
  }
}
