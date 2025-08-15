import { getLibs } from '../../scripts/utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';
import template from '../template-promo/templateProps.js';

  // JavaScript object containing all properties used by the template variable
// Based on analysis of template-rendering.js

const template2 = {
  // Core template identification
  id: "urn:aaid:sc:VA6C2:abd317d8-0dfe-474f-8261-9a43829b559e", // Used for iframe src, modal id, tracking, and CSS class generation
  
  // Asset type classification
  assetType: "Template", // Special handling for webpage templates (sets empty pages array)
  
  // Licensing and access control
  licensingCategory: "free", // Values: "free" | "premium" - determines plan icon display
  
  // Title information (multiple sources)
  "dc:title": {
    "i-default": "Template Title String" // Primary title source
  },

   // Title information (multiple sources)
   title: {
    "i-default": "Template Title String" // Primary title source
  },
  
  
  // Content categorization
  moods: ["playful"], // Array of mood strings for title generation
  task: {
    name: "task-name" // Task name combined with moods for title
  },
  
  // API endpoints for rendering
  _links: {
    "http://ns.adobe.com/adobecloud/rel/rendition": {
      "href": "https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:abd317d8-0dfe-474f-8261-9a43829b559e/rendition?assetType=TEMPLATE&etag=001ca9a165b66eecf08d604ac2c74c42{&page,size,type,fragment}",
      "templated": true,
      "mode": "id",
      "name": "ACP"
    },
    "http://ns.adobe.com/adobecloud/rel/component": {
    "href": "https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:abd317d8-0dfe-474f-8261-9a43829b559e/component?assetType=TEMPLATE&etag=001ca9a165b66eecf08d604ac2c74c42{&revision,component_id}",
    "templated": true,
    "mode": "id",
    "name": "ACP"
},
  },
  
  // User interaction URLs
  customLinks: {
    branchUrl: "https://adobesparkpost.app.link/fYeg178OVzb" // Used for edit buttons and sharing functionality
  },

  
  
  // Template content pages
  pages: [
    {
        "task": {
            "name": "instagram-square-post",
            "size": {
                "name": "1080x1080px"
            }
        },
        "extractedColors": [
            {
                "name": "white",
                "coverage": 0.326,
                "mode": "RGB",
                "value": {
                    "r": 244,
                    "g": 236,
                    "b": 244
                }
            },
            {
                "name": "pink",
                "coverage": 0.4821,
                "mode": "RGB",
                "value": {
                    "r": 240,
                    "g": 156,
                    "b": 188
                }
            },
            {
                "name": "black",
                "coverage": 0.0286,
                "mode": "RGB",
                "value": {
                    "r": 12,
                    "g": 9,
                    "b": 10
                }
            },
            {
                "name": "yellow",
                "coverage": 0.0852,
                "mode": "RGB",
                "value": {
                    "r": 244,
                    "g": 233,
                    "b": 89
                }
            },
            {
                "name": "blue",
                "coverage": 0.0782,
                "mode": "RGB",
                "value": {
                    "r": 77,
                    "g": 92,
                    "b": 229
                }
            }
        ],
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
]
};


let createTag;
let getConfig;

async function createTemplates(itemTamplates) {
  console.log('createTemplates itemTamplates', itemTamplates);
  // const res = await fetchResults(recipe);
  // const templates = await Promise.all(
  //   res.items
  //     .filter((item) => isValidTemplate(item))
  //     .map((item) => renderTemplate(item)),
  // );

    const templates = await Promise.all(
      itemTamplates
      // .filter((item) => isValidTemplate(item))
      .map((item) => renderTemplate(item)),
  );
  console.log('createTemplates templates', templates);

  // const items = itemTamplates.filter((item) => item?.id && item?.title);
  // const templates = await Promise.all(items.map((item) => renderTemplate(item)));
  templates.forEach((tplt) => {
    tplt.classList.add('template');
    console.log('tplt', tplt, tplt.classList);
  });
  return templates;
}

async function createTemplatesContainer(templatesParm) {
  const templatesContainer = createTag('div', { class: 'templates-container' });
  const [templates] = await Promise.all([createTemplates(templatesParm)]);
  console.log('createTemplatesContainer templates', templates);
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

console.log('template2', template2);
console.log('template', template);

// function decorateHeadingRow(headingRow) {
//   headingRow.classList.add('heading-row');
//   headingRow.querySelector('h1,h2,h3,h4,h5')?.classList.add('heading');
//   [...headingRow.querySelectorAll('p')].forEach((p) => p.classList.add('subcopy'));
// }

export default async function init(el, pictureElements) {
  el.classList.add('template-x-carousel');
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  // const [headingRow, recipeRow] = el.children;
  // decorateHeadingRow(headingRow);
  // const recipe = recipeRow.textContent.trim();
  // recipeRow.remove();



  try {
    // TODO: lazy load templates
    const [{ templatesContainer, control: galleryControl }] = await Promise.all(
      [createTemplatesContainer([template, template, template, template])],
    );

    console.log('templatesContainer', templatesContainer);
    console.log('galleryControl', galleryControl);
    console.log('el', el);
    
    
    pictureElements.forEach((picture) => {
      picture.parentElement.parentElement.remove();
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
