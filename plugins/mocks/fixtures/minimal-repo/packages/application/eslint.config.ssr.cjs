const baseConfig = require('../../../../../../eslint.config.cjs');
const ssr = require('../../../../../../tools/eslint-rules/configs/eslint-ssr.config.cjs');
module.exports = [...baseConfig, ...ssr];
