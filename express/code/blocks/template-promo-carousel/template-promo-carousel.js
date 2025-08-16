import { getLibs } from '../../scripts/utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

let createTag;
let getConfig;

async function createTemplates(itemTamplates) {
  const templates = await Promise.all(itemTamplates.map((item) => renderTemplate(item)));

  templates.forEach((tplt) => tplt.classList.add('template'));
  return templates;
}

async function createTemplatesContainer(templatesParm) {
  const templatesContainer = createTag('div', { class: 'templates-container' });
  const [templates] = await Promise.all([createTemplates(templatesParm)]);

  templatesContainer.append(...templates);
  const { control: initialControl } = await buildGallery(
    [...templates],
    templatesContainer,
    { center: true },
  );

  return {
    templatesContainer,
    control: initialControl,
  };
}

export default async function init(el, imageElementsArray) {
  const imageElements = imageElementsArray || [...(el?.querySelectorAll('picture') || [])];
  el.classList.add('template-promo-carousel');
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));

  const baseTemplateMap = {
    assetType: "Template", // Special handling for webpage templates (sets empty pages array)
    licensingCategory: "free", // Values: "free" | "premium" - determines plan icon display
    'dc:title': {
      'i-default': "Template Title String YEIBER" // Primary title source
    },
    pages: [
      {
        "rendition": {
          "image": {
            "thumbnail": {
                "componentId": "c4b97f82-b38b-4e97-abac-014e24270f0f",
                "hzRevision": "0",
                "width": 500,
                "height": 500,
                "mediaType": "image/webp"
            },
            "preview": {
                "componentId": "dc188d19-5941-418c-bfa3-4c3689709a22",
                "hzRevision": "0",
                "width": 1200,
                "height": 1200,
                "mediaType": "image/webp"
            }
          }
        }
      }
    ],
    customLinks: {
      branchUrl: "https://new.express.adobe.com/id/urn:aaid:sc:US:7747c721-20e8-5722-95f6-d6a6fe258d6f?invite=true&accept=true&promoid=Z2G1FQKR&mv=other" // Used for edit buttons and sharing functionality
    },
    _links: {
      "http://ns.adobe.com/adobecloud/rel/rendition": {
        href: 'https://mwpw-176304--express-milo--adobecom.aem.page/drafts/yeiber/media_1ca9af5fc08551f78d084a11ebb6e99c518507dbf.png?width=2000&format=webply&optimize=medium',
        templated: true,
      },
      'http://ns.adobe.com/adobecloud/rel/component': { // image of the template
        href: 'https://mwpw-176304--express-milo--adobecom.aem.page/drafts/yeiber/media_1ca9af5fc08551f78d084a11ebb6e99c518507dbf.png?width=2000&format=webply&optimize=medium',
        templated: true,
      },
    }
  };

  const templatesArray = imageElements.map((img) => {
    console.log('Processing image element:', img);
    const imagesToTemplateInfoMap = {
      'dc:title': {
        'i-default': img?.alt || '',
      },
      title: img?.alt || '',
      _links: {
        "http://ns.adobe.com/adobecloud/rel/rendition": {
          href: img.src,
          templated: true,
        },
        'http://ns.adobe.com/adobecloud/rel/component': {
          href: img.src,
          templated: true,
        },
      }
    }   
    
    return { ...baseTemplateMap, ...imagesToTemplateInfoMap };
  });

  try {
    const [{ templatesContainer, control: galleryControl }] = await Promise.all(
      [createTemplatesContainer(templatesArray)],
    );

    imageElements.forEach((img) => {
      img?.parentElement?.parentElement?.remove();
    });

    el.append(templatesContainer);
    el.append(galleryControl);
  } catch (err) {
    window.lana?.log(`Error in template-x-carousel-toolbar: ${err}`);
    if (getConfig().env.name === 'prod') {
      el.remove();
    } else {
      console.log('Error in template-x-carousel-toolbar:', err);
      const errElement = createTag('div')
      errElement.textContent = 'Error loading templates, please refresh the page or try again later.';
      el.append(errElement);
    }
  }
}