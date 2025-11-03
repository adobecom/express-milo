import { useEffect } from '../vendor/htm-preact.js';
import {
  getCanonicalUrl,
  upsertTitleAndDescriptionRespectingAuthored,
  getAuthoredOverrides,
  buildProductJsonLd,
  upsertLdJson,
  buildBreadcrumbsJsonLdFromDom,
} from '../utilities/seo.js';
import { useStore } from './store-context.js';

function mapStateToSeoPayload(state, templateId) {
  const descriptionComponents = Array.isArray(state.descriptionComponents)
    ? state.descriptionComponents.map((item) => ({ description: item.descriptionHTML }))
    : [];

  const numericPrice = (() => {
    const priceString = state.pricing?.unitPrice || state.pricing?.totalPrice || '';
    const normalized = priceString.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  })();

  return {
    productTitle: state.title,
    productDescriptions: descriptionComponents,
    heroImage: state.selectedRealview?.url,
    productPrice: numericPrice,
    id: templateId,
    templateId,
  };
}

export function useSeo(templateId) {
  const { state } = useStore();

  useEffect(() => {
    const snapshot = state.value;
    if (!snapshot) {
      return;
    }

    const payload = mapStateToSeoPayload(snapshot, templateId);
    upsertTitleAndDescriptionRespectingAuthored(payload);

    const canonicalUrl = getCanonicalUrl();
    const overrides = getAuthoredOverrides(document);

    buildProductJsonLd(payload, overrides, canonicalUrl)
      .then((json) => {
        if (json) {
          upsertLdJson('pdp-product-jsonld', json);
        }
      })
      .catch((error) => {
        window.reportError?.(error);
      });

    const breadcrumbs = buildBreadcrumbsJsonLdFromDom();
    if (breadcrumbs) {
      upsertLdJson('pdp-breadcrumbs-jsonld', breadcrumbs);
    }
  }, [state.value, templateId]);
}

