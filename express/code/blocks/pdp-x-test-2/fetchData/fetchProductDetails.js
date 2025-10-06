export default async function fetchProductDetails(productId) {
  let productDetailsFetch;
  try {
    productDetailsFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/getproduct?productId=${productId}`);
  } catch (error) {
    productDetailsFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProduct.json');
  }
  const productDetailsJSON = await productDetailsFetch.json();
  const productDetails = productDetailsJSON.data;
  return productDetails;
}
