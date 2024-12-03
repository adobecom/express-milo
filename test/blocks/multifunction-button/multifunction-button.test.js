/* eslint-env mocha */
/* eslint-disable no-unused-vars */
const imports = await Promise.all([
  import('../../../expresscode/scripts/scripts.js'),
  import('../../../expresscode/blocks/multifunction-button/multifunction-button.js'),
]);
const { default: decorate } = imports[1];
