/* eslint-env mocha */
/* eslint-disable no-unused-vars */

const [, { default: decorate }] = await Promise.all([import('../../../expresscode/scripts/scripts.js'), import('../../../expresscode/blocks/content-toggle/content-toggle.js')]);
