// 768/1024/1280/1440/1600/1920
const breakpoints = ['m', 'tablet', 'l', 'desktop', 'xl', 'xxl'];
export default async function init(el) {
  const background = el.children[0];
  background.classList.add('background');
  const imgs = [...background.querySelectorAll('img')];
  imgs.forEach((img, index) => {
    img.classList.add(`${breakpoints[index]}-background`);
  });
  const foreground = el.children[el.children.length - 1];
  foreground.classList.add('foreground');
}
