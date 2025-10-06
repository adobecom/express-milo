export default function createDeliveryEstimatePill(productDetails) {
  const deliveryEstimatePillContainer = document.createElement('div');
  deliveryEstimatePillContainer.className = 'pdpx-delivery-estimate-pill';
  const deliveryEstimatePillIcon = document.createElement('img');
  deliveryEstimatePillIcon.src = '/express/code/icons/delivery-truck.svg';
  const deliveryEstimatePillText = document.createElement('span');
  deliveryEstimatePillText.innerHTML = `${productDetails.deliveryEstimateStringText} `;
  const deliveryEstimatePillDate = document.createElement('span');
  deliveryEstimatePillDate.innerHTML = productDetails.deliveryEstimateDate;
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillIcon);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillText);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillDate);
  return deliveryEstimatePillContainer;
}
