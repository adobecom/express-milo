export function extractProductId(block) {
  return block.children[0].children[1].textContent;
}

export function normalizeProductDetailObject(APIResponse) {
  const normalizedProductDetails = {
    heroImage: APIResponse.product.initialPrettyPreferredViewUrl,
    productTitle: APIResponse.product.title,
    deliveryEstimateStringText: 'Order today and get it by',
    deliveryEstimateDate: 'Aug 20 - 26',
  };
  return normalizedProductDetails;
}
