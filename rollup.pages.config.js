const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'gh-pages/playground/js/bundle/mr-template.js',
    format: 'iife',
    name: 'mrTemplate',
    sourcemap: false,
  },
  plugins: [commonjs(), nodeResolve(), terser()],
};
