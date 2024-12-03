/* eslint-env mocha */
/* eslint-disable no-unused-vars */

const [, { default: decorate }] = await Promise.all([
  import('../../../expresscode/scripts/scripts.js'),
  import('../../../expresscode/blocks/quick-action-hub/quick-action-hub.js'),
]);
