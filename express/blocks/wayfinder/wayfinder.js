export default function decorate(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows[0].classList.add('text-row');
  rows[1].classList.add('cta-row');
  rows[1].querySelectorAll('a').forEach((a) => {
    a.classList.add('button');
  });
}
