import {
  getTemplateTitle,
  extractRenditionLinkHref,
  extractComponentLinkHref,
} from '../../../../../scripts/template-utils.js';

function getImageSrc(template) {
  const thumbnail = template.pages[0].rendition.image?.thumbnail;
  const componentLinkHref = extractComponentLinkHref(template);
  const renditionLinkHref = extractRenditionLinkHref(template);
  const { mediaType, componentId, hzRevision } = thumbnail;
  if (mediaType === 'image/webp') {
    // webp only supported by componentLink
    return componentLinkHref.replace(
      '{&revision,component_id}',
      `&revision=${hzRevision || 0}&component_id=${componentId}`
    );
  }

  return renditionLinkHref.replace(
    '{&page,size,type,fragment}',
    `&type=${mediaType}&fragment=id=${componentId}`
  );
}

export default function Template({ data }) {
  const templateContent = (
    <img src={getImageSrc(data)} alt={getTemplateTitle(data)}></img>
  );
  return (
    <div className="flex flex-col template">
      {templateContent}
    </div>
  );
}
