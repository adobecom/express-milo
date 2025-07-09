export default function decorate(el) {
  const rows = el.querySelectorAll(':scope > div');
  const firstRowContent = rows[0].textContent.trim();
  rows[0].classList.add('text-row');
  rows[1].classList.add('cta-row');
  rows[1].setAttribute('role', 'group');
  rows[1].setAttribute('aria-label', firstRowContent);
  rows[1].querySelectorAll('a').forEach((a) => {
    a.classList.add('button');
    a.setAttribute('role', 'button');
  });
}
