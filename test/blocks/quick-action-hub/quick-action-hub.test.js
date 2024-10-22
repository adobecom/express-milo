/* eslint-env mocha */
/* eslint-disable no-unused-vars */

const [, { default: decorate }] = await Promise.all([
  import('../../../express/scripts/scripts.js'),
  import('../../../express/blocks/quick-action-hub/quick-action-hub.js'),
]);
