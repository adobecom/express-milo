// import { generateDocumentPath } from "./utils.js";

const metadataMap = {
  'og:title': 'Title',
  'og:image': 'Image',
  'og:description': 'Description',
  'primaryproductname': 'Primaryproductname',
  'show-free-plan': 'Show Free Plan',
  'author': 'Author',
  'publication-date': 'Publication Date',
  'category': 'Category',
  'subheading': 'Subheading',
  'short-title': 'Short Title',
};

const makeProxySrcs = (main, url, path) => {
  main.querySelectorAll('img').forEach((img) => {
    if (img.src.startsWith('/')) {
      // make absolute
      const cu = new URL(url);
      img.src = `${cu.origin}${img.src}`;
    }
    else if (img.src.startsWith('.')) {
      // const cu = new URL(url);
      
      img.src = `${url.substring(0, url.lastIndexOf('/'))}${img.src}`;
    }
    try {
      const u = new URL(img.src);
      u.searchParams.append('host', u.origin);
      img.src = `http://localhost:3001${u.pathname}${u.search}`;
    } catch (error) {
      console.warn(`Unable to make proxy src for ${img.src}: ${error.message}`);
    }
  });
};

const createMetadataBlock = (main, document) => {
  const meta = {};

  for (const [key, value] of Object.entries(metadataMap)) {
    const el = document.querySelector(`[property="${key}"]`) || document.querySelector(`[name="${key}"]`);
    // init default empty value
    meta[value] = '';
    if (el) {
      if (key === 'og:image') {
        // create an <img> element
        const img = document.createElement('img');
        img.src = el.content;
        meta[value] = img;
      } else {
        meta[value] = el.content;
      }
    }
  }

  // tags
  const tags = document.querySelectorAll('[property="article:tag"], [name="article:tag"]');
  meta['Tags'] = [...tags].map((tag) => tag.content).join(', ');

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  main.append(block);

  return meta;
};

const createCardMetadataBlock = (metadata, main, document) => {
  const meta = {};

  meta['Style'] = 'default';
  meta['ContentType'] = 'express-blog';
  meta['Title'] = metadata['Title'];
  meta['Description'] = metadata['Description'];
  meta['CardImage'] = metadata['Image'].cloneNode(true) || '';
  meta['Created'] = metadata['Publication Date'];
  meta['PrimaryTag'] = 'caas:content-type/blog';
  meta['Tags'] = 'caas:content-type/blog';

  const block = WebImporter.Blocks.getMetadataBlock(document, meta)
  block.querySelector('th').innerHTML = 'Card Metadata';
  main.append(block);
};

export default {
  transformDOM: ({ document, params }) => {
    const main = document.querySelector('main');

    const u = new URL(params.originalURL);
    const ORIGIN = u.origin;

    /**
     * header / hero
     */
    const heroDiv = document.createElement('div');
    heroDiv.append(document.querySelector('main h1'));
    heroDiv.append(document.querySelector('main picture'));
    const hero = WebImporter.DOMUtils.createTable([
      ['hero'],
      [heroDiv],
    ], document);
    main.prepend(hero);

    // const hero = document.querySelector('.hero');
    // if (hero) {
    //   const title = hero.querySelector('h1');
    //   if (title) {
    //     hero.before(title);
    //   }
    //   const image = hero.querySelector(':scope > div > picture img');
    //   if (image) {
    //     hero.before(image);
    //   }
    //   hero.before(document.createElement('hr'));
    //   hero.remove();
    // }

    /**
     * content
     */

    // table-of-contents -> toc
    const toc = document.querySelector('.table-of-contents');
    if (toc) {
      toc.parentElement.before(document.createElement('hr'));
      const levelsEl = toc.querySelector(':scope > div > div:last-child')
      const levels = levelsEl ? parseInt(levelsEl.textContent): 2;
      const tocBlock = WebImporter.DOMUtils.createTable([
        ['toc'],
        ['levels', levels],
      ], document);
      toc.after(document.createElement('hr'));
      toc.after(WebImporter.DOMUtils.createTable([
        ['section metadata'],
        ['style', 'xxl spacing'],
      ], document));
      toc.replaceWith(tocBlock);
    }

    // template list -> columns
    document.querySelectorAll('.template-list').forEach((templateList) => {
      // console.log(templateList.outerHTML);

      // const items = templateList.querySelectorAll(':scope > div');

      // console.log(items.length);
      const items = [...templateList.querySelectorAll(':scope > div')].map((item) => {
        const div = document.createElement('div');
        
        const subItems = item.querySelectorAll(':scope > div');

        // image - subItems[0]
        const img = document.createElement('img');
        img.src = subItems[0].querySelector('img').src;
        const imgLink = subItems[0].querySelector('a');
        if (imgLink) {
          if (imgLink.href.startsWith('/')) {
            imgLink.href = `${ORIGIN}${imgLink.href}`;
          }
          img.alt = imgLink.href + " | " + (imgLink.textContent || 'link');
        }

        // console.log(item.outerHTML);
        // console.log(subItems.length);

        const link = document.createElement('a');
        link.href = item.href;
        link.innerHTML = subItems[1].textContent;

        div.innerHTML = img.outerHTML + "<br />" + subItems[1].querySelector('a').outerHTML;
        // div.append(link);

        return [div];
      });

      if (items.length > 0) {
        const columns = WebImporter.DOMUtils.createTable([
          ['columns (contained, template-list)'],
          [...items],
        ], document);
  
        templateList.replaceWith(columns);
      }
    });

    // banner -> aside
    const banner = document.querySelector('.banner');
    if (banner) {
      // make banner link italic
      const a = banner.querySelector('a');
      if (a) {
        const iEl = document.createElement('I');
        a.after(iEl);
        iEl.append(a);
      }

      // replace banner with a Milo aside block
      const aside = WebImporter.DOMUtils.createTable([
        ['aside (notification, medium, center, dark)'],
        ['#5C5CE0'],
        [banner.innerHTML],
      ], document);
      banner.replaceWith(aside);
    }

    // how-to-steps -> how-to
    document.querySelectorAll('.how-to-steps').forEach((howToStepsEl) => {
      // look for closest heading above
      let heading = document.createElement('h2');
      heading.innerHTML = 'How To';

      const closestHeading = howToStepsEl.previousElementSibling;
      if (closestHeading && closestHeading.nodeName.startsWith('H')) {
        heading = closestHeading.cloneNode(true);
        closestHeading.remove();
      }

      const ul = document.createElement('ul');
      [...howToStepsEl.querySelectorAll(':scope > div')].forEach((div) => {
        const li = document.createElement('li');

        const liHeader = `<strong>${div.children[0].innerHTML}</strong>`;
        const liContent = div.children[1].innerHTML;
        li.innerHTML = `${liHeader}<br />${liContent}`;
        ul.append(li);
      });
      const howto = WebImporter.DOMUtils.createTable([
        ['how to'],
        [heading],
        [ul],
      ], document);
      howToStepsEl.replaceWith(howto);
    });


    // faq -> accordion (seo)
    document.querySelectorAll('.faq').forEach((faq) => {
      const items = [...faq.querySelectorAll(':scope > div')].reduce((acc, div) => {
        const subItems = [...div.querySelectorAll(':scope > div')]
        acc.push(...subItems.map((el) => [el]));
        return acc;
      }, []);

      console.log(items)
      const accBlock = WebImporter.DOMUtils.createTable([
        ['accordion (seo)'],
        ...items,
      ], document);
      faq.replaceWith(accBlock);
    });

    // blog posts -> caas
    const caasLink = document.createElement('a');
    caasLink.href = 'https://milo.adobe.com/tools/caas#eyJhZGRpdGlvbmFsUmVxdWVzdFBhcmFtcyI6W10sImFuYWx5dGljc0NvbGxlY3Rpb25OYW1lIjoiIiwiYW5hbHl0aWNzVHJhY2tJbXByZXNzaW9uIjpmYWxzZSwiYW5kTG9naWNUYWdzIjpbXSwiYXV0b0NvdW50cnlMYW5nIjp0cnVlLCJib29rbWFya0ljb25TZWxlY3QiOiIiLCJib29rbWFya0ljb25VbnNlbGVjdCI6IiIsImNhcmRTdHlsZSI6IjE6MiIsImNhcmRUaXRsZUFjY2Vzc2liaWxpdHlMZXZlbCI6NiwiY29sbGVjdGlvbkJ0blN0eWxlIjoicHJpbWFyeSIsImNvbGxlY3Rpb25OYW1lIjoiIiwiY29sbGVjdGlvblRpdGxlIjoiIiwiY29sbGVjdGlvblNpemUiOiIiLCJjb250YWluZXIiOiIxMjAwTWF4V2lkdGgiLCJjb250ZW50VHlwZVRhZ3MiOltdLCJjb3VudHJ5IjoiY2Fhczpjb3VudHJ5L3VzIiwiY3VzdG9tQ2FyZCI6IiIsImN0YUFjdGlvbiI6Il9ibGFuayIsImRvTm90TGF6eUxvYWQiOmZhbHNlLCJkaXNhYmxlQmFubmVycyI6ZmFsc2UsImRyYWZ0RGIiOmZhbHNlLCJlbmRwb2ludCI6Ind3dy5hZG9iZS5jb20vY2hpbWVyYS1hcGkvY29sbGVjdGlvbiIsImVudmlyb25tZW50IjoiIiwiZXhjbHVkZWRDYXJkcyI6W10sImV4Y2x1ZGVUYWdzIjpbXSwiZmFsbGJhY2tFbmRwb2ludCI6IiIsImZlYXR1cmVkQ2FyZHMiOltdLCJmaWx0ZXJFdmVudCI6IiIsImZpbHRlckJ1aWxkUGFuZWwiOiJhdXRvbWF0aWMiLCJmaWx0ZXJMb2NhdGlvbiI6ImxlZnQiLCJmaWx0ZXJMb2dpYyI6Im9yIiwiZmlsdGVycyI6W10sImZpbHRlcnNDdXN0b20iOltdLCJmaWx0ZXJzU2hvd0VtcHR5IjpmYWxzZSwiZ3V0dGVyIjoiNHgiLCJoZWFkZXJzIjpbXSwiaGlkZUN0YUlkcyI6W10sImhpZGVDdGFUYWdzIjpbXSwiaW5jbHVkZVRhZ3MiOltdLCJsYW5ndWFnZSI6ImNhYXM6bGFuZ3VhZ2UvZW4iLCJsYXlvdXRUeXBlIjoiM3VwIiwibG9hZE1vcmVCdG5TdHlsZSI6InByaW1hcnkiLCJvbmx5U2hvd0Jvb2ttYXJrZWRDYXJkcyI6ZmFsc2UsIm9yTG9naWNUYWdzIjpbXSwicGFnaW5hdGlvbkFuaW1hdGlvblN0eWxlIjoicGFnZWQiLCJwYWdpbmF0aW9uRW5hYmxlZCI6ZmFsc2UsInBhZ2luYXRpb25RdWFudGl0eVNob3duIjpmYWxzZSwicGFnaW5hdGlvblR5cGUiOiJwYWdpbmF0b3IiLCJwYWdpbmF0aW9uVXNlVGhlbWUzIjpmYWxzZSwicGxhY2Vob2xkZXJVcmwiOiIiLCJyZXN1bHRzUGVyUGFnZSI6IjMiLCJzZWFyY2hGaWVsZHMiOltdLCJzZXRDYXJkQm9yZGVycyI6dHJ1ZSwic2hvd0Jvb2ttYXJrc0ZpbHRlciI6ZmFsc2UsInNob3dCb29rbWFya3NPbkNhcmRzIjpmYWxzZSwic2hvd0ZpbHRlcnMiOmZhbHNlLCJzaG93U2VhcmNoIjpmYWxzZSwic2hvd1RvdGFsUmVzdWx0cyI6ZmFsc2UsInNvcnREYXRlQXNjIjpmYWxzZSwic29ydERhdGVEZXNjIjpmYWxzZSwic29ydERhdGVNb2RpZmllZCI6ZmFsc2UsInNvcnREZWZhdWx0IjoiZGF0ZURlc2MiLCJzb3J0RW5hYmxlUG9wdXAiOmZhbHNlLCJzb3J0RW5hYmxlUmFuZG9tU2FtcGxpbmciOmZhbHNlLCJzb3J0RXZlbnRTb3J0IjpmYWxzZSwic29ydEZlYXR1cmVkIjpmYWxzZSwic29ydE1vZGlmaWVkQXNjIjpmYWxzZSwic29ydE1vZGlmaWVkRGVzYyI6ZmFsc2UsInNvcnRSYW5kb20iOmZhbHNlLCJzb3J0UmVzZXJ2b2lyUG9vbCI6MTAwMCwic29ydFJlc2Vydm9pclNhbXBsZSI6Mywic29ydFRpdGxlQXNjIjpmYWxzZSwic29ydFRpdGxlRGVzYyI6ZmFsc2UsInNvdXJjZSI6WyJiYWNvbSJdLCJ0YWdzVXJsIjoid3d3LmFkb2JlLmNvbS9jaGltZXJhLWFwaS90YWdzIiwidGFyZ2V0QWN0aXZpdHkiOiIiLCJ0YXJnZXRFbmFibGVkIjpmYWxzZSwidGhlbWUiOiJsaWdodGVzdCIsImRldGFpbHNUZXh0T3B0aW9uIjoiZGVmYXVsdCIsInRpdGxlSGVhZGluZ0xldmVsIjoiaDMiLCJ0b3RhbENhcmRzVG9TaG93IjoiMyIsInVzZUxpZ2h0VGV4dCI6ZmFsc2UsInVzZU92ZXJsYXlMaW5rcyI6ZmFsc2UsImNvbGxlY3Rpb25CdXR0b25TdHlsZSI6InByaW1hcnkiLCJ1c2VySW5mbyI6W119';
    caasLink.textContent = 'CaaS - Collection Details XXXX';

    document.querySelectorAll('.blog-posts').forEach((blogPost) => {
      blogPost.replaceWith(caasLink.cloneNode(true));
    });

    // try adobe express today link -> CTA button
    document.querySelectorAll('a[href*="adobesparkpost.app.link"]').forEach((link) => {
      if (link.textContent.toLowerCase() === 'try adobe express today') {
        link.before(document.createElement('hr'));
        link.after(document.createElement('hr'));
        link.after(WebImporter.DOMUtils.createTable([
          ['section metadata'],
          ['style', 'center'],
        ], document));
        const strongEl = document.createElement('strong');
        link.before(strongEl);
        strongEl.append(link);
      }
    });

    /**
     * bottom
     */

    const metadata = createMetadataBlock(main, document);
    createCardMetadataBlock(metadata, main, document);

    // remove header and footer from main
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      '.disclaimer',
      '.tags.block',
    ]);
    
    makeProxySrcs(main, params.originalURL);

    return main;
  },

  // generateDocumentPath: generateDocumentPath,

};
