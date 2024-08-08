/* eslint-env mocha */
/* eslint-disable no-unused-vars */
const imports = await Promise.all([
  import('../../../express/scripts/scripts.js'),
  import('../../../express/blocks/multifunction-button/multifunction-button.js'),
]);
const { default: decorate } = imports[1];
