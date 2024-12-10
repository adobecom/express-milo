export function splitAndAddVariantsWithDash(block) {
  // split and add options with a dash
  // (fullscreen-center -> fullscreen-center + fullscreen + center)
  const extra = [];
  block.classList.forEach((className, index) => {
    if (index === 0) return; // block name, no split
    const split = className.split('-');
    if (split.length > 1) {
      split.forEach((part) => {
        extra.push(part);
      });
    }
  });
  block.classList.add(...extra);
}

export function normalizeHeadings(block, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level}>${tag.textContent.trim()}</h${level}>`;
      }
    }
  });
}
