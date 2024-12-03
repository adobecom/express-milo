/* eslint-env mocha */
/* eslint-disable no-unused-vars */

const [, { default: decorate }] = await Promise.all([import('../../../express/code/scripts/scripts.js'), import('../../../express/code/blocks/content-toggle/content-toggle.js')]);
