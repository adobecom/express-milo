export default async function init(el) {
  const background = el.children[0];
  background.classList.add('background');
  const foreground = el.children[1];
  foreground.classList.add('foreground');
}
