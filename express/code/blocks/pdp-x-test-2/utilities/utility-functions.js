export function extractProductId(block) {
  return block.children[0].children[1].textContent;
}

export function normalizeProductDetailObject(productDetails, productPrice) {
  const normalizedProductDetails = {
    heroImage: productDetails.product.initialPrettyPreferredViewUrl,
    productTitle: productDetails.product.title,
    price: productPrice.unitPrice,
    deliveryEstimateStringText: 'Order today and get it by',
    deliveryEstimateDate: 'Aug 20 - 26',
  };
  return normalizedProductDetails;
}
