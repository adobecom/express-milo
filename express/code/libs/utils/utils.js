// Mock utils.js for testing
export function getConfig() {
  return {
    locale: { ietf: 'en-US' },
    codeRoot: '/express/code',
  };
}

export function getMetadata(name) {
  return `mock-${name}`;
}

export function createTag(tag, attributes = {}, html = '') {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  if (html) element.innerHTML = html;
  return element;
}
