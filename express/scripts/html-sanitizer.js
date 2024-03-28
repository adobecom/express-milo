const HtmlSanitizer = new (function handSanitizer() {
  const tagWL = {
    A: true,
    ABBR: true,
    B: true,
    BLOCKQUOTE: true,
    BODY: true,
    BR: true,
    CENTER: true,
    CODE: true,
    DD: true,
    DIV: true,
    DL: true,
    DT: true,
    EM: true,
    FONT: true,
    H1: true,
    H2: true,
    H3: true,
    H4: true,
    H5: true,
    H6: true,
    HR: true,
    I: true,
    IMG: true,
    LABEL: true,
    LI: true,
    OL: true,
    P: true,
    PRE: true,
    PICTURE: true,
    SMALL: true,
    SOURCE: true,
    SPAN: true,
    STRONG: true,
    SUB: true,
    SUP: true,
    TABLE: true,
    TBODY: true,
    TR: true,
    TD: true,
    TH: true,
    THEAD: true,
    UL: true,
    U: true,
    VIDEO: true,
  };

  const contentTagWL = {
    FORM: true,
    'GOOGLE-SHEETS-HTML-ORIGIN': true,
  }; // tags that will be converted to DIVs

  const attributeWL = {
    align: true,
    alt: true,
    color: true,
    controls: true,
    height: true,
    href: true,
    id: true,
    src: true,
    srcset: true,
    style: true,
    target: true,
    title: true,
    type: true,
    width: true,
    class: true,
    loading: true,
    media: true,
    'data-align': true,
    'data-valign': true,
  };

  const cssWL = {
    'background-color': true,
    color: true,
    'font-size': true,
    'font-weight': true,
    'text-align': true,
    'text-decoration': true,
    display: true,
    width: true,
  };

  const schemaWL = ['http:', 'https:', 'data:', 'm-files:', 'file:', 'ftp:', 'mailto:', 'pw:']; // which "protocols" are allowed in "href", "src" etc

  const uriAttributes = {
    href: true,
    action: true,
    src: true,
  };

  function startsWithAny(str, substrings) {
    for (let i = 0; i < substrings.length; i += 1) {
      if (str.indexOf(substrings[i]) === 0) {
        return true;
      }
    }
    return false;
  }

  const parser = new DOMParser();

  this.SanitizeHtml = function sanitize(inputValue, extraSelector) {
    let input = inputValue.trim();
    if (input === '') return ''; // to save performance

    // firefox "bogus node" workaround for wysiwyg's
    if (input === '<br>') return '';

    if (input.indexOf('<body') === -1) input = `<body>${input}</body>`; // add "body" otherwise some tags are skipped, like <style>

    const doc = parser.parseFromString(input, 'text/html');

    // DOM clobbering check (damn you firefox)
    if (doc.body.tagName !== 'BODY') doc.body.remove();
    if (typeof doc.createElement !== 'function') doc.createElement.remove();

    function makeSanitizedCopy(node) {
      let newNode;
      if (node.nodeType === Node.TEXT_NODE) {
        newNode = node.cloneNode(true);
      } else if (node.nodeType === Node.ELEMENT_NODE && (tagWL[node.tagName]
        || contentTagWL[node.tagName]
        || (extraSelector && node.matches(extraSelector)))) { // is tag allowed?
        if (contentTagWL[node.tagName]) {
          newNode = doc.createElement('DIV'); // convert to DIV
        } else {
          newNode = doc.createElement(node.tagName);
        }

        for (let i = 0; i < node.attributes.length; i += 1) {
          const attr = node.attributes[i];
          if (attributeWL[attr.name.toLowerCase()]) {
            if (attr.name === 'style') {
              for (let s = 0; s < node.style.length; s += 1) {
                const styleName = node.style[s];
                if (cssWL[styleName]) {
                  newNode.style.setProperty(styleName, node.style.getPropertyValue(styleName));
                }
              }
            } else {
              if (uriAttributes[attr.name]) {
                // eslint-disable-next-line no-continue
                if (attr.value.indexOf(':') > -1 && !startsWithAny(attr.value, schemaWL)) continue;
              }
              newNode.setAttribute(attr.name, attr.value);
            }
          }
        }
        for (let i = 0; i < node.childNodes.length; i += 1) {
          const subCopy = makeSanitizedCopy(node.childNodes[i]);
          newNode.appendChild(subCopy);
        }

        // remove useless empty spans (lots of those when pasting from MS Outlook)
        if ((newNode.tagName === 'SPAN' || newNode.tagName === 'B' || newNode.tagName === 'I' || newNode.tagName === 'U')
          && newNode.innerHTML.trim() === '') {
          return doc.createDocumentFragment();
        }
      } else {
        newNode = doc.createDocumentFragment();
      }
      return newNode;
    }

    const resultElement = makeSanitizedCopy(doc.body);

    return resultElement.innerHTML
      .replace(/<br[^>]*>(\S)/g, '<br>\n$1')
      .replace(/div><div/g, 'div>\n<div'); // replace is just for cleaner code
  };

  this.AllowedTags = tagWL;
  this.AllowedAttributes = attributeWL;
  this.AllowedCssStyles = cssWL;
  this.AllowedSchemas = schemaWL;
})();

export default HtmlSanitizer;
