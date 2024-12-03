/* eslint-env mocha */
/* eslint-disable no-unused-vars */
const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/multifunction-button/multifunction-button.js'),
]);
const { default: decorate } = imports[1];
